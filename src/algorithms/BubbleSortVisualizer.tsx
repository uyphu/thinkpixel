import { useEffect, useState, useRef } from "react";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

interface Bar {
  value: number;
  state: "default" | "comparing" | "swapping" | "sorted";
}

interface BubbleSortVisualizerProps {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  isSorting: boolean;
  isPaused: boolean;
  stepMode: boolean;
  stepSignal: number;
}

const BubbleSortVisualizer = ({
  array,
  setArray,
  isSorting,
  isPaused,
  stepMode,
  stepSignal,
}: BubbleSortVisualizerProps) => {
  const isPausedRef = useRef(isPaused);
  const isStepModeRef = useRef(stepMode);
  const stepSignalRef = useRef(stepSignal);
  const isSortingNow = useRef(false);
  const shouldStopRef = useRef(false);

  const [bars, setBars] = useState<Bar[]>([]);
  const [speed, setSpeed] = useState(300);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, passes: 0 });

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
    setStats({ comparisons: 0, swaps: 0, passes: 0 });
  }, [array]);

  useEffect(() => {
    shouldStopRef.current = true;
    isSortingNow.current = false;
  }, [array]);

  useEffect(() => {
    if (isSorting && (!isPaused || (stepMode && stepSignal > 0))) {
      bubbleSort();
    }
  }, [isSorting, isPaused, stepMode, stepSignal]);

  const bubbleSort = async () => {
    if (!array.length) return;
    if (isSortingNow.current) return;

    shouldStopRef.current = false;
    isSortingNow.current = true;

    let arr = [...bars];

    for (let i = 0; i < arr.length; i++) {
      if (shouldStopRef.current) {
        isSortingNow.current = false;
        return;
      }
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (shouldStopRef.current) {
          isSortingNow.current = false;
          return;
        }

        await checkPause();

        arr = updateBarStates(arr, j, "comparing");
        setBars([...arr]);
        setStats((s) => ({ ...s, comparisons: s.comparisons + 1 }));

        await delay(speed);

        if (isStepModeRef.current && stepSignalRef.current > 0) {
          stepSignalRef.current--;
        }

        if (arr[j].value > arr[j + 1].value) {
          await checkPause();

          arr = updateBarStates(arr, j, "swapping");
          setBars([...arr]);
          await delay(speed);

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setStats((s) => ({ ...s, swaps: s.swaps + 1 }));

          if (isStepModeRef.current && stepSignalRef.current > 0) {
            stepSignalRef.current--;
          }
        }

        await checkPause();

        arr = resetBarStates(arr, j);
        setBars([...arr]);
        await delay(speed);

        if (isStepModeRef.current && stepSignalRef.current > 0) {
          stepSignalRef.current--;
        }
      }

      arr[arr.length - 1 - i].state = "sorted";
      setBars([...arr]);
      setStats((s) => ({ ...s, passes: s.passes + 1 }));
    }

    setBars(arr.map((bar) => ({ ...bar, state: "sorted" })));
    setArray(arr.map((bar) => bar.value));
    isSortingNow.current = false;
  };

  const checkPause = async () => {
    while (isPausedRef.current && !isStepModeRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (isStepModeRef.current) {
      while (stepSignalRef.current <= 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  const delay = async (ms: number) => {
    const interval = 50;
    const iterations = Math.ceil(ms / interval);

    for (let i = 0; i < iterations; i++) {
      if (isPausedRef.current && !isStepModeRef.current) {
        while (isPausedRef.current && !isStepModeRef.current) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  };

  const updateBarStates = (arr: Bar[], index: number, state: Bar["state"]) => {
    const newArr = [...arr];
    newArr[index].state = state;
    newArr[index + 1].state = state;
    return newArr;
  };

  const resetBarStates = (arr: Bar[], index: number) => {
    const newArr = [...arr];
    if (newArr[index].state !== "sorted") newArr[index].state = "default";
    if (newArr[index + 1].state !== "sorted") newArr[index + 1].state = "default";
    return newArr;
  };

  const bubbleSortCode = [
    "function bubbleSort(arr) {",
    "  let n = arr.length;",
    "  for (let i = 0; i < n; i++) {",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}"
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8">
      <div className="flex-1 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Comparisons" value={stats.comparisons} />
          <StatCard label="Swaps" value={stats.swaps} />
          <StatCard label="Passes" value={stats.passes} />
        </div>
        <div className="mb-4">
          <label htmlFor="speed" className="text-sm font-medium mr-2">Speed:</label>
          <input
            id="speed"
            type="range"
            min="50"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-40"
          />
        </div>
        <div className="flex items-end justify-center h-96 bg-gray-100 rounded-lg p-4 shadow-inner w-full">
          {bars.map((bar, index) => (
            <motion.div
              key={index}
              layout
              transition={{ type: "spring", stiffness: 150 }}
              className={`w-8 mx-1 relative transition-colors duration-300 ease-in-out ${
                bar.state === "comparing"
                  ? "bg-yellow-400"
                  : bar.state === "swapping"
                  ? "bg-red-500"
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

      <div className="flex-1 min-w-[300px] max-w-[600px]">
        {/* <h2 className="text-xl font-semibold mb-2">Bubble Sort Code</h2> */}
        <CodeBlock codeLines={bubbleSortCode} language="javascript" />
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

export default BubbleSortVisualizer;
