import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center text-gray-500 p-6 bg-gray-100 border-t mt-12">
      <div className="mb-4 md:mb-0">© 2025 ThinkPixel</div>
      <div className="flex gap-6">
        <Link to="/about" className="hover:text-blue-600 transition">About</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        <Link to="/terms" className="hover:text-blue-600 transition">Terms</Link>
      </div>
    </footer>
  );
};

export default Footer;
