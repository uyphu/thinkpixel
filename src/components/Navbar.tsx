import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex justify-between items-center p-4">
      <div className="text-2xl font-bold text-blue-600">ThinkPixel</div>
      <div className="hidden md:flex gap-6 text-gray-700">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/interview-prep">Interview Prep</Link> {/* Future */}
      </div>
    </nav>
  );
};

export default Navbar;
