import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Terms of Service</h1>
        <p className="max-w-2xl text-lg text-gray-700 mb-8">
          By using ThinkPixel, you agree to the following basic terms:  
          - This platform is for educational purposes only.  
          - Content and algorithms are subject to improvements and updates.  
          Full legal terms will be published soon as part of the public release.
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

export default Terms;
