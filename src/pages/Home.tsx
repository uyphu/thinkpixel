import { Link } from "react-router-dom";

interface Algorithm {
  name: string;
  path: string;
}

const algorithms: Algorithm[] = [
  { name: "Bubble Sort", path: "/visualizer/bubble-sort" },
  { name: "Selection Sort", path: "/visualizer/selection-sort" },
  { name: "Insertion Sort", path: "/visualizer/insertion-sort" },
  { name: "Binary Search", path: "/visualizer/binary-search" },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">ThinkPixel</h1>
      <p className="text-lg mb-10 text-gray-700">Choose an Algorithm to Visualize:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {algorithms.map((algo) => (
          <Link
            key={algo.name}
            to={algo.path}
            className="block p-6 bg-white rounded-lg shadow hover:bg-blue-50 transition"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800">{algo.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
