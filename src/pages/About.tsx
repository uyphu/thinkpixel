import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">About ThinkPixel</h1>
        <p className="max-w-2xl text-lg text-gray-700 mb-8">
          ThinkPixel is a modern, interactive platform designed to help developers and learners visualize algorithms, 
          understand complex coding concepts through animations, and prepare for technical interviews.
          Our goal is to make computer science concepts more intuitive, accessible, and engaging through dynamic simulations.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 mb-8">
          Future expansions will include visualizing data structures, graph algorithms, dynamic programming, 
          and providing real-world coding challenges in a highly interactive environment.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          ← Back to Home
        </Link>
      </section>
    </Layout>
  );
};

export default About;
