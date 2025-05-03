import { Link } from "react-router-dom";

interface Algorithm {
  name: string;
  path: string;
  description: string;
}

const algorithms: Algorithm[] = [
  { 
    name: "Bubble Sort", 
    path: "/visualizer/bubble-sort", 
    description: "Repeatedly swap adjacent elements if they are in the wrong order." 
  },
  { 
    name: "Selection Sort", 
    path: "/visualizer/selection-sort", 
    description: "Select the minimum element and place it at the beginning." 
  },
  { 
    name: "Insertion Sort", 
    path: "/visualizer/insertion-sort", 
    description: "Insert each element into its correct position in the sorted part." 
  },
  { 
    name: "Merge Sort", 
    path: "/visualizer/merge-sort", 
    description: "Divide the array into halves, sort them, and merge back together." 
  },
  { 
    name: "Quick Sort", 
    path: "/visualizer/quick-sort", 
    description: "Partition the array around a pivot and recursively sort subarrays." 
  },
  { 
    name: "Binary Search", 
    path: "/visualizer/binary-search", 
    description: "Efficiently search by repeatedly dividing the array in half." 
  },
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
