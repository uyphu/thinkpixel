import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center text-gray-500 p-6 border-t">
      <div>© 2025 ThinkPixel</div>
      <div className="flex gap-4">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/terms">Terms</Link>
      </div>
    </footer>
  );
};

export default Footer;
