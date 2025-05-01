import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import CodeBlock from "../components/CodeBlock";

interface Bar {
  value: number;
  state: "default" | "comparing" | "overwriting" | "sorted";
}

type Task =
  | { type: "mergeSort"; start: number; end: number }
  | { type: "merge"; start: number; mid: number; end: number };

interface MergeSortVisualizerProps {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  isSorting: boolean;
  isPaused: boolean;
  stepMode: boolean;
  stepSignal: number;
}

const MergeSortVisualizer = ({
  array,
  setArray,
  isSorting,
  isPaused,
  stepMode,
  stepSignal,
}: MergeSortVisualizerProps) => {
  const isPausedRef = useRef(isPaused);
  const isStepModeRef = useRef(stepMode);
  const stepSignalRef = useRef(stepSignal);

  const [bars, setBars] = useState<Bar[]>([]);
  const [tasksQueue, setTasksQueue] = useState<Task[]>([]);
  const [speed, setSpeed] = useState(300);
  const [stats, setStats] = useState({ comparisons: 0, overwrites: 0 });
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
    setStats({ comparisons: 0, overwrites: 0 });
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
        prepareMergeSort();
      } else {
        executeNextTask();
      }
    }
  }, [isSorting, isPaused, stepMode, stepSignal]);

  const prepareMergeSort = () => {
    shouldStopRef.current = false;
    isSortingNow.current = true;
    const initialTasks: Task[] = [{ type: "mergeSort", start: 0, end: bars.length - 1 }];
    setTasksQueue(initialTasks);
  };

  const executeNextTask = () => {
    if (shouldStopRef.current) return;
    if (tasksQueue.length === 0) {
      finishSorting();
      return;
    }

    const currentTask = tasksQueue[0];

    if (currentTask.type === "mergeSort") {
      const { start, end } = currentTask;
      if (start >= end) {
        setTasksQueue((prev) => prev.slice(1));
        return;
      }

      const mid = Math.floor((start + end) / 2);

      const newTasks: Task[] = [
        { type: "mergeSort", start, end: mid },
        { type: "mergeSort", start: mid + 1, end },
        { type: "merge", start, mid, end },
      ];

      setTasksQueue((prev) => [...newTasks, ...prev.slice(1)]); // Insert new tasks
    } else if (currentTask.type === "merge") {
      performMerge(currentTask.start, currentTask.mid, currentTask.end);
      setTasksQueue((prev) => prev.slice(1));
    }
  };

  const performMerge = (start: number, mid: number, end: number) => {
    let arr = [...bars];

    // ✅ FIX: COPY left and right parts safely
    const left = arr.slice(start, mid + 1).map((bar) => ({ ...bar }));
    const right = arr.slice(mid + 1, end + 1).map((bar) => ({ ...bar }));

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      if (left[i].value <= right[j].value) {
        arr[k].value = left[i].value;
        i++;
      } else {
        arr[k].value = right[j].value;
        j++;
      }
      arr[k].state = "overwriting"; // Highlight while overwriting
      k++;
    }

    while (i < left.length) {
      arr[k].value = left[i].value;
      arr[k].state = "overwriting";
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k].value = right[j].value;
      arr[k].state = "overwriting";
      j++;
      k++;
    }

    setBars([...arr]);

    setTimeout(() => {
      setBars((prev) =>
        prev.map((bar, idx) => ({
          ...bar,
          state: idx >= start && idx <= end ? "default" : bar.state,
        }))
      );
    }, speed);

    setStats((s) => ({
      comparisons: s.comparisons + left.length + right.length,
      overwrites: s.overwrites + (end - start + 1),
    }));
  };

  const finishSorting = () => {
    setBars((prev) => prev.map((bar) => ({ ...bar, state: "sorted" })));
    isSortingNow.current = false;
  };

  const leftRef = useRef<HTMLDivElement>(null);
const [leftHeight, setLeftHeight] = useState(0);

// Auto-measure height of left column
useLayoutEffect(() => {
  if (leftRef.current) {
    setLeftHeight(leftRef.current.offsetHeight);
  }
}, [bars, stats, speed]); // optionally re-trigger if bars/stats change

return (
  <div className="flex flex-col lg:flex-row gap-8 w-full p-8">
    {/* Left Panel: Controls, Stats, Visualization */}
    <div className="flex-1 flex flex-col items-center" ref={leftRef}>
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
        <StatCard label="Overwrites" value={stats.overwrites} />
      </div>

      {/* Visualization */}
      <div className="flex items-end justify-center h-96 w-full max-w-6xl bg-gray-100 rounded-lg p-4 shadow-inner overflow-x-auto">
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            layout
            transition={{ type: "spring", stiffness: 150 }}
            className={`w-8 mx-1 relative transition-colors duration-300 ease-in-out ${
              bar.state === "comparing"
                ? "bg-yellow-400"
                : bar.state === "overwriting"
                ? "bg-purple-500"
                : bar.state === "sorted"
                ? "bg-green-400"
                : "bg-blue-400"
            }`}
            style={{ height: `${bar.value}px` }}
          >
            <span data-testid="bar-value" className="absolute bottom-full mb-1 text-xs font-mono w-full text-center">
              {bar.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Right Panel: CodeBlock */}
    <div className="flex-1 min-w-[300px] max-w-[600px]">
      {/* <h2 className="text-xl font-semibold mb-2 text-center">Merge Sort Code</h2> */}
      <div
        className="bg-gray-900 rounded-lg shadow p-4 overflow-auto"
        style={{ height: leftHeight }}
      >
        <CodeBlock codeLines={mergeSortCode} language="javascript" />
      </div>
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

const mergeSortCode = [
  "function mergeSort(arr) {",                          // 1
  "  if (arr.length <= 1) return arr;",                 // 2
  "  const mid = Math.floor(arr.length / 2);",          // 3
  "  const left = mergeSort(arr.slice(0, mid));",       // 4
  "  const right = mergeSort(arr.slice(mid));",         // 5
  "  return merge(left, right);",                       // 6
  "}",                                                  // 7
  "",                                                   // 8
  "function merge(left, right) {",                      // 9
  "  const result = [];",                               // 10
  "  let i = 0, j = 0;",                                 // 11
  "  while (i < left.length && j < right.length) {",    // 12
  "    if (left[i] < right[j]) {",                      // 13
  "      result.push(left[i]);",                        // 14
  "      i++;",                                         // 15
  "    } else {",                                       // 16
  "      result.push(right[j]);",                       // 17
  "      j++;",                                         // 18
  "    }",                                              // 19
  "  }",                                                // 20
  "  return result.concat(left.slice(i)).concat(right.slice(j));", // 21
  "}",                                                  // 22
];


export default MergeSortVisualizer;
