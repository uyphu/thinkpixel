import { useEffect, useState } from "react";
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
  const [bars, setBars] = useState<Bar[]>([]);
  const [speed, setSpeed] = useState(300);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, passes: 0 });
  const [isWaitingForStep, setIsWaitingForStep] = useState(false);

  // Sync bars with prop array
  useEffect(() => {
    setBars(array.map((value) => ({ value, state: "default" })));
    setStats({ comparisons: 0, swaps: 0, passes: 0 });
    setIsWaitingForStep(false);
  }, [array]);

  // Handle sorting when isSorting or stepSignal changes
  useEffect(() => {
    if (isSorting && (!isPaused || (stepMode && stepSignal > 0))) {
      bubbleSort();
    }
  }, [isSorting, isPaused, stepMode, stepSignal]);

  const bubbleSort = async () => {
    if (!array.length) return;

    let arr = [...bars];
    let hasChanged = false;

    for (let i = stats.passes; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // In step mode, pause after each comparison/swap
        if (stepMode && isWaitingForStep) {
          while (isWaitingForStep && stepSignal === 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          setIsWaitingForStep(false);
        }

        // Check for pause
        if (isPaused && !stepMode) {
          while (isPaused && !stepMode) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        // Highlight comparing bars
        arr = updateBarStates(arr, j, "comparing");
        setBars([...arr]);
        setStats((s) => ({ ...s, comparisons: s.comparisons + 1 }));
        hasChanged = true;
        await delay(speed);

        if (stepMode) {
          setIsWaitingForStep(true);
          return; // Pause for user to click Step
        }

        if (arr[j].value > arr[j + 1].value) {
          // Swap bars with animation
          arr = updateBarStates(arr, j, "swapping");
          setBars([...arr]);
          await delay(speed);

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setStats((s) => ({ ...s, swaps: s.swaps + 1 }));
          hasChanged = true;

          if (stepMode) {
            setIsWaitingForStep(true);
            return; // Pause for user to click Step
          }
        }

        // Reset non-sorted bars
        arr = resetBarStates(arr, j);
        setBars([...arr]);
        await delay(speed);
      }

      // Mark sorted element
      arr[arr.length - 1 - i].state = "sorted";
      setBars([...arr]);
      setStats((s) => ({ ...s, passes: s.passes + 1 }));
      hasChanged = true;

      if (stepMode) {
        setIsWaitingForStep(true);
        return; // Pause for user to click Step
      }
    }

    // Mark all as sorted
    if (hasChanged) {
      setBars(arr.map((bar) => ({ ...bar, state: "sorted" })));
      setArray(arr.map((bar) => bar.value));
    }
  };

  // Helper functions
  const updateBarStates = (arr: Bar[], index: number, state: Bar["state"]) => {
    const newArr = [...arr];
    newArr[index].state = state;
    newArr[index + 1].state = state;
    return newArr;
  };

  const resetBarStates = (arr: Bar[], index: number) => {
    const newArr = [...arr];
    if (newArr[index].state !== "sorted") newArr[index].state = "default";
    if (newArr[index + 1].state !== "sorted")
      newArr[index + 1].state = "default";
    return newArr;
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="flex flex-col items-center w-full p-8">
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
      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
        <StatCard label="Comparisons" value={stats.comparisons} />
        <StatCard label="Swaps" value={stats.swaps} />
        <StatCard label="Passes" value={stats.passes} />
      </div>

      {/* Visualization */}
      <div className="flex items-end justify-center h-96 w-full max-w-6xl bg-gray-100 rounded-lg p-4 shadow-inner">
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            layout
            transition={{ type: "spring", stiffness: 150 }}
            className={`w-8 mx-1 relative transition-colors duration-300 ${
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
            <span className="absolute bottom-full mb-1 text-xs font-mono w-full text-center">
              {bar.value}
            </span>
          </motion.div>
        ))}
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