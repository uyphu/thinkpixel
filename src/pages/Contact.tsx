import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Contact Us</h1>
        <p className="max-w-xl text-lg text-gray-700 mb-8">
          We'd love to hear from you!  
          For feedback, inquiries, or support, please contact our team at:  
          <span className="text-blue-500 font-semibold"> support@thinkpixel.dev </span>
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

export default Contact;
