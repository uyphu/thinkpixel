import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BubbleSortVisualizer from "../algorithms/BubbleSortVisualizer";
import SelectionSortVisualizer from "../algorithms/SelectionSortVisualizer";
import InsertionSortVisualizer from "../algorithms/InsertionSortVisualizer";
import MergeSortVisualizer from "../algorithms/MergeSortVisualizer";

// Mapping of algorithm names to their visualizer components
const algorithmMap: Record<string, React.ComponentType<any>> = {
  "bubble-sort": BubbleSortVisualizer,
  "selection-sort": SelectionSortVisualizer,
  "insertion-sort": InsertionSortVisualizer, 
  "merge-sort": MergeSortVisualizer,
};

const Visualizer = () => {
  const { algorithmName } = useParams<{ algorithmName: string }>();
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [stepSignal, setStepSignal] = useState(0); // Trigger for stepping

  // Generate a random array when component mounts
  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray: number[] = Array.from({ length: 15 }, () =>
      Math.floor(Math.random() * 90) + 10 // Values between 10 and 100
    );
    setArray(newArray);
    setIsSorting(false);
    setIsPaused(false);
    setStepMode(false);
    setStepSignal(0);
  };

  const startSorting = () => {
    if (!isSorting) {
      setIsSorting(true);
      setIsPaused(false);
      setStepMode(false);
    }
  };

  const pauseResume = () => {
    if (stepMode) {
      setStepMode(false); // Exit step mode when resuming
    }
    setIsPaused((prev) => !prev);
  };

  const enterStepMode = () => {
    if (!isSorting) {
      setIsSorting(true);
      setIsPaused(true);
      setStepMode(true);
    } else if (!stepMode) {
      setIsPaused(true);
      setStepMode(true);
    }
  };

  const step = () => {
    if (stepMode && isSorting) {
      setStepSignal((prev) => prev + 1); // Trigger next step
    }
  };

  // Get the visualizer component dynamically
  const VisualizerComponent = algorithmName
    ? algorithmMap[algorithmName]
    : null;

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          {algorithmName?.replace("-", " ").toUpperCase()} Visualization
        </h1>

        {VisualizerComponent ? (
          <VisualizerComponent
            array={array}
            setArray={setArray}
            isSorting={isSorting}
            isPaused={isPaused}
            stepMode={stepMode}
            stepSignal={stepSignal}
          />
        ) : (
          <p className="text-red-500">Algorithm not found</p>
        )}

        {/* Control Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={startSorting}
            disabled={isSorting && !isPaused && !stepMode}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            aria-label="Start sorting"
          >
            Play
          </button>
          <button
            onClick={pauseResume}
            disabled={!isSorting}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            aria-label={isPaused ? "Resume sorting" : "Pause sorting"}
          >
            {isPaused && !stepMode ? "Resume" : "Pause"}
          </button>
          <button
            onClick={enterStepMode}
            disabled={stepMode && isSorting}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            aria-label="Enter step-by-step sorting mode"
          >
            Step Mode
          </button>
          <button
            onClick={step}
            disabled={!stepMode || !isSorting}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            aria-label="Step through sorting"
          >
            Step
          </button>
          <button
            onClick={resetArray}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            aria-label="Reset array"
          >
            Reset
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Visualizer;
