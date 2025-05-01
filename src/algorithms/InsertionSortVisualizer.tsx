import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CodeBlock from "../components/CodeBlock";

interface Bar {
  value: number;
  state: "default" | "comparing" | "highlighted-current" | "sorted";
}

interface InsertionSortVisualizerProps {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  isSorting: boolean;
  isPaused: boolean;
  stepMode: boolean;
  stepSignal: number;
}

const InsertionSortVisualizer = ({
  array,
  setArray,
  isSorting,
  isPaused,
  stepMode,
  stepSignal,
}: InsertionSortVisualizerProps) => {
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
      insertionSort();
    }
  }, [isSorting, isPaused, stepMode, stepSignal]);


    const insertionSort = async () => {
        if (!array.length) return;
        if (isSortingNow.current) return;
    
        shouldStopRef.current = false;
        isSortingNow.current = true;
    
        const arr = [...bars];
    
        for (let i = 1; i < arr.length; i++) {
        if (shouldStopRef.current) {
            isSortingNow.current = false;
            return;
        }
    
        const currentBar = { ...arr[i] }; // ✅ Keep original bar safe
        let j = i - 1;
    
        arr[i].state = "highlighted-current";
        setBars([...arr]);
        await delay(speed);
    
        while (j >= 0 && arr[j].value > currentBar.value) {
            if (shouldStopRef.current) {
            isSortingNow.current = false;
            return;
            }
    
            await checkPause();
    
            arr[j + 1].value = arr[j].value; // ✅ Only shift existing bars right
            arr[j + 1].state = "comparing";
            arr[j].state = "comparing";
    
            setBars([...arr]);
            setStats((s) => ({ ...s, comparisons: s.comparisons + 1 }));
    
            await delay(speed);
    
            if (isStepModeRef.current && stepSignalRef.current > 0) {
            stepSignalRef.current--;
            }
    
            arr[j + 1].state = "default";
            arr[j].state = "default";
    
            j--;
        }
    
        arr[j + 1].value = currentBar.value; // ✅ Insert currentValue AFTER shifting done
        arr[j + 1].state = "highlighted-current";
    
        setBars([...arr]);
        setStats((s) => ({ ...s, swaps: s.swaps + 1 }));
    
        await delay(speed);
    
        arr[j + 1].state = "sorted";
        setBars([...arr]);
        setStats((s) => ({ ...s, passes: (s.passes + 1) }));
    
        await delay(speed);
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
        <CodeBlock codeLines={codeLines} language="javascript" />
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

const codeLines = [
    "function insertionSort(arr) {",               // 1
    "  for (let i = 1; i < arr.length; i++) {",    // 2
    "    let current = arr[i];",                   // 3
    "    let j = i - 1;",                           // 4
    "    while (j >= 0 && arr[j] > current) {",    // 5
    "      arr[j + 1] = arr[j];",                  // 6
    "      j--;",                                  // 7
    "    }",                                       // 8
    "    arr[j + 1] = current;",                   // 9
    "  }",                                         // 10
    "  return arr;",                               // 11
    "}",                                           // 12
  ];

export default InsertionSortVisualizer;
