import { Link } from "react-router-dom";

interface Algorithm {
  name: string;
  path: string;
  description: string;
}

const algorithms: Algorithm[] = [
  { name: "Bubble Sort", path: "/visualizer/bubble-sort", description: "Simple adjacent element swapping sort." },
  { name: "Selection Sort", path: "/visualizer/selection-sort", description: "Select the minimum and place in order." },
  { name: "Insertion Sort", path: "/visualizer/insertion-sort", description: "Insert each item into its proper place." },
  { name: "Merge Sort", path: "/visualizer/merge-sort", description: "Merge each item into its proper place." },
  { name: "Binary Search", path: "/visualizer/binary-search", description: "Efficient searching by halving the array." },
];

const AlgorithmGrid = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">Explore Algorithms</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {algorithms.map((algo) => (
          <Link
            key={algo.name}
            to={algo.path}
            className="group block p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-center text-gray-800 group-hover:text-blue-600">{algo.name}</h3>
            <p className="text-sm text-gray-500 text-center mt-3">{algo.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AlgorithmGrid;
