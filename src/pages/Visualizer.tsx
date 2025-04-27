import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

interface RouteParams {
  algorithmName: string;
}

const Visualizer = () => {
  const { algorithmName } = useParams<RouteParams>();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pt-20 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            {algorithmName?.replace("-", " ").toUpperCase()} Visualization
        </h1>

        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-white shadow-sm mb-10">
            {/* Visualization Canvas Placeholder */}
            <p className="text-gray-400">Visualization Canvas Coming Soon...</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Play
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
            Pause
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Step
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Reset
            </button>
        </div>
        </div>
    </Layout>
  );
};

export default Visualizer;

