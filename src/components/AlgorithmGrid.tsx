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

const AlgorithmGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {algorithms.map((algo) => (
        // <Link
        //   key={algo.name}
        //   to={algo.path}
        //   className="block p-6 bg-white rounded-lg shadow hover:bg-blue-50 transition"
        // >
        //   <h2 className="text-2xl font-semibold text-center text-gray-800">{algo.name}</h2>
        // </Link>
        <Link
        key={algo.name}
        to={algo.path}
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">{algo.name}</h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          {/* Optional: short description, placeholder for now */}
          Visualize how {algo.name} works step-by-step!
        </p>
      </Link>
      ))}
    </section>
  );
};

export default AlgorithmGrid;
