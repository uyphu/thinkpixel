import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Bar {
  value: number;
  state: "default" | "comparing" | "found" | "discarded";
}

type Task =
  | { type: "compare"; index: number }
  | { type: "discardLeft"; left: number }
  | { type: "discardRight"; right: number }
  | { type: "found"; index: number }
  | { type: "notFound" };

interface BinarySearchVisualizerProps {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  isSorting: boolean;
  isPaused: boolean;
  stepMode: boolean;
  stepSignal: number;
}

const BinarySearchVisualizer = ({
  array,
  setArray,
  isSorting,
  isPaused,
  stepMode,
  stepSignal,
}: BinarySearchVisualizerProps) => {
  const isPausedRef = useRef(isPaused);
  const isStepModeRef = useRef(stepMode);
  const stepSignalRef = useRef(stepSignal);

  const [bars, setBars] = useState<Bar[]>([]);
  const [tasksQueue, setTasksQueue] = useState<Task[]>([]);
  const [speed, setSpeed] = useState(300);
  const [targetInput, setTargetInput] = useState("");
  const [target, setTarget] = useState<number | null>(null);
  const [searchStarted, setSearchStarted] = useState(false);
  const [message, setMessage] = useState("");
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
    const sortedArray = [...array].sort((a, b) => a - b);
    setBars(sortedArray.map((value) => ({ value, state: "default" })));
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
      if (!isSortingNow.current && searchStarted) {
        prepareBinarySearch();
      } else {
        executeNextTask();
      }
    }
  }, [isSorting, isPaused, stepMode, stepSignal, searchStarted]);

  const prepareBinarySearch = () => {
    shouldStopRef.current = false;
    isSortingNow.current = true;

    const tasks: Task[] = [];
    let left = 0;
    let right = bars.length - 1;
    let found = false;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      tasks.push({ type: "compare", index: mid });

      if (bars[mid].value === target) {
        tasks.push({ type: "found", index: mid });
        found = true;
        break;
      } else if (bars[mid].value < (target ?? 0)) {
        tasks.push({ type: "discardLeft", left: mid });
        left = mid + 1;
      } else {
        tasks.push({ type: "discardRight", right: mid });
        right = mid - 1;
      }
    }

    if (!found) {
      tasks.push({ type: "notFound" });
    }

    setTasksQueue(tasks);
  };

  const executeNextTask = () => {
    if (shouldStopRef.current || tasksQueue.length === 0) return;
    const currentTask = tasksQueue[0];

    if (currentTask.type === "compare") highlightCompare(currentTask.index);
    else if (currentTask.type === "discardLeft") discardLeft(currentTask.left);
    else if (currentTask.type === "discardRight") discardRight(currentTask.right);
    else if (currentTask.type === "found") {
      highlightFound(currentTask.index);
      finishSearch(`Target ${target} Found!`);
    } else if (currentTask.type === "notFound") {
      finishSearch(`Target ${target} Not Found.`);
    }

    setTasksQueue((prev) => prev.slice(1));
  };

  const highlightCompare = (index: number) => {
    setBars((prev) =>
      prev.map((bar, i) => ({
        ...bar,
        state: i === index ? "comparing" : bar.state,
      }))
    );
  };

  const discardLeft = (left: number) => {
    setBars((prev) =>
      prev.map((bar, i) => ({
        ...bar,
        state: i <= left ? "discarded" : bar.state,
      }))
    );
  };

  const discardRight = (right: number) => {
    setBars((prev) =>
      prev.map((bar, i) => ({
        ...bar,
        state: i >= right ? "discarded" : bar.state,
      }))
    );
  };

  const highlightFound = (index: number) => {
    setBars((prev) =>
      prev.map((bar, i) => ({
        ...bar,
        state: i === index ? "found" : bar.state,
      }))
    );
  };

  const finishSearch = (msg: string) => {
    setMessage(msg);
    shouldStopRef.current = true;
    isSortingNow.current = false;
    setSearchStarted(false);
    setTarget(null);
  };

  const handleStartSearch = () => {
    const parsed = parseInt(targetInput);
    if (!isNaN(parsed)) {
      setTarget(parsed);
      setSearchStarted(true);
      setMessage(`Ready to search for ${parsed}`);
    } else {
      setMessage("Please enter a valid number");
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-8">
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Enter target"
          value={targetInput}
          onChange={(e) => {
            setTargetInput(e.target.value);
            setSearchStarted(false);
            setMessage("");
          }}
          className="border rounded px-2 py-1 w-32"
        />
        <button
          onClick={handleStartSearch}
          disabled={searchStarted || targetInput.trim() === ""}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Start Search
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-700">Speed:
        <input
          type="range"
          min="50"
          max="1000"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="ml-2 w-32"
        />
      </div>

      {message && <div className="text-lg font-bold text-green-600 mb-6">{message}</div>}

      <div className="flex items-end justify-center h-96 w-full max-w-6xl bg-gray-100 rounded-lg p-4 shadow-inner">
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            layout
            transition={{ type: "spring", stiffness: 150 }}
            className={`w-8 mx-1 relative transition-colors duration-300 ease-in-out ${
              bar.state === "comparing"
                ? "bg-yellow-400"
                : bar.state === "found"
                ? "bg-green-400"
                : bar.state === "discarded"
                ? "bg-gray-400"
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

export default BinarySearchVisualizer;
