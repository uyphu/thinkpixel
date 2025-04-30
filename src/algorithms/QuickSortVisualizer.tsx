import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CodeBlock from "../components/CodeBlock";

interface Bar {
  value: number;
  state: "default" | "pivot" | "comparing" | "swapping" | "sorted";
}

type Task =
  | { type: "quickSort"; start: number; end: number }
  | { type: "partition"; start: number; end: number };

interface QuickSortVisualizerProps {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  isSorting: boolean;
  isPaused: boolean;
  stepMode: boolean;
  stepSignal: number;
}

const QuickSortVisualizer = ({
  array,
  setArray,
  isSorting,
  isPaused,
  stepMode,
  stepSignal,
}: QuickSortVisualizerProps) => {
  const isPausedRef = useRef(isPaused);
  const isStepModeRef = useRef(stepMode);
  const stepSignalRef = useRef(stepSignal);

  const [bars, setBars] = useState<Bar[]>([]);
  const [tasksQueue, setTasksQueue] = useState<Task[]>([]);
  const [speed, setSpeed] = useState(300);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const isSortingNow = useRef(false);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isStepModeRef.current = stepMode;
  }, [stepMode]);

  useEffect(() => {
    stepSignalRef.current = stepSignal;
  }, [stepSignal]);

  useEffect(() => {
    setBars(array.map((value) => ({ value, state: "default" })));
    setStats({ comparisons: 0, swaps: 0 });
  }, [array]);

  useEffect(() => {
    shouldStopRef.current = true;
    isSortingNow.current = false;
  }, [array]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSorting && !isPaused && !stepMode) {
      interval = setInterval(() => {
        executeNextTask();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isSorting, isPaused, stepMode, speed, tasksQueue]);

  useEffect(() => {
    if (isSorting && (!isPaused || (stepMode && stepSignal > 0))) {
      if (!isSortingNow.current) {
        prepareQuickSort();
      } else {
        executeNextTask();
      }
    }
  }, [isSorting, isPaused, stepMode, stepSignal]);

  const prepareQuickSort = () => {
    shouldStopRef.current = false;
    isSortingNow.current = true;
    const initialTasks: Task[] = [{ type: "quickSort", start: 0, end: bars.length - 1 }];
    setTasksQueue(initialTasks);
  };

  const executeNextTask = () => {
    if (shouldStopRef.current) return;
    if (tasksQueue.length === 0) {
      finishSorting();
      return;
    }

    const currentTask = tasksQueue[0];

    if (currentTask.type === "quickSort") {
      const { start, end } = currentTask;
      if (start >= end) {
        setTasksQueue((prev) => prev.slice(1));
        return;
      }
      setTasksQueue((prev) => [
        { type: "partition", start, end },
        ...prev.slice(1),
      ]);
    } else if (currentTask.type === "partition") {
      partition(currentTask.start, currentTask.end);
      setTasksQueue((prev) => prev.slice(1));
    }
  };

  const partition = (start: number, end: number) => {
    const arr = [...bars];
    const pivotValue = arr[end].value;
    let pivotIndex = start;

    arr[end].state = "pivot";

    for (let i = start; i < end; i++) {
      arr[i].state = "comparing";
      setBars([...arr]);

      setStats((s) => ({ ...s, comparisons: s.comparisons + 1 }));

      if (arr[i].value < pivotValue) {
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        arr[i].state = "swapping";
        arr[pivotIndex].state = "swapping";
        pivotIndex++;
        setStats((s) => ({ ...s, swaps: s.swaps + 1 }));
      }

      setBars([...arr]);
    }

    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    arr[pivotIndex].state = "sorted";

    for (let j = start; j <= end; j++) {
      if (j !== pivotIndex) arr[j].state = "default";
    }

    setBars([...arr]);

    setTimeout(() => {
      const newTasks: Task[] = [
        { type: "quickSort", start, end: pivotIndex - 1 },
        { type: "quickSort", start: pivotIndex + 1, end },
      ];
      setTasksQueue((prev) => [...newTasks, ...prev]);
    }, speed);
  };

  const finishSorting = () => {
    setBars((prev) => prev.map((bar) => ({ ...bar, state: "sorted" })));
    isSortingNow.current = false;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full p-8">
      {/* Left Panel: Controls, Stats, Visualization */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="speed">Speed:</label>
            <input
              id="speed"
              type="range"
              min="50"
              max="1000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-32"
              aria-label="Adjust sorting speed"
            />
          </div>
        </div>
  
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
          <StatCard label="Comparisons" value={stats.comparisons} />
          <StatCard label="Swaps" value={stats.swaps} />
        </div>
  
        {/* Visualization */}
        <div className="flex items-end justify-center h-96 w-full max-w-6xl bg-gray-100 rounded-lg p-4 shadow-inner overflow-x-auto">
          {bars.map((bar, index) => (
            <motion.div
              key={index}
              layout
              transition={{ type: "spring", stiffness: 150 }}
              className={`w-8 mx-1 relative transition-colors duration-300 ease-in-out ${
                bar.state === "pivot"
                  ? "bg-yellow-500"
                  : bar.state === "comparing"
                  ? "bg-yellow-300"
                  : bar.state === "swapping"
                  ? "bg-red-500"
                  : bar.state === "sorted"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
              style={{ height: `${bar.value}px` }}
            >
              <span className="absolute bottom-full mb-1 text-xs font-mono w-full text-center">
                {bar.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
  
      {/* Right Panel: CodeBlock */}
      <div className="flex-1 min-w-[300px] max-w-[600px]">
        {/* <h2 className="text-xl font-semibold mb-2 text-center">Quick Sort Code</h2> */}
        <CodeBlock codeLines={quickSortCode} language="javascript" />
      </div>
    </div>
  );
  
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <div className="text-gray-600 text-sm">{label}</div>
    <div className="text-2xl font-bold text-blue-600">{value}</div>
  </div>
);

const quickSortCode = [
    "function quickSort(arr) {",                             // 1
    "  if (arr.length <= 1) return arr;",                    // 2
    "  const pivot = arr[arr.length - 1];",                  // 3
    "  const left = [];",                                    // 4
    "  const right = [];",                                   // 5
    "  for (let i = 0; i < arr.length - 1; i++) {",          // 6
    "    if (arr[i] < pivot) left.push(arr[i]);",            // 7
    "    else right.push(arr[i]);",                          // 8
    "  }",                                                   // 9
    "  return [...quickSort(left), pivot, ...quickSort(right)];", // 10
    "}",                                                     // 11
  ];

export default QuickSortVisualizer;
