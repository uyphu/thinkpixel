const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
      {/* Logo or Icon (Optional) */}
      <div className="mb-6">
        <div className="flex items-center justify-center bg-blue-500 rounded-full w-20 h-20 shadow-lg">
          <span className="text-white text-4xl font-bold">🧠</span> {/* Cute Brain Icon for Thinking */}
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
        Welcome to ThinkPixel
      </h1>

      {/* Sub Heading */}
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8">
        Visualize algorithms like Bubble Sort, Selection Sort, and more — 
        step-by-step, smooth, and intuitive. Make learning algorithms fun again!
      </p>

      {/* CTA (Optional, if you want later) */}
      {/* <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-300">
        Get Started
      </button> */}
    </section>
  );
};

export default HeroSection;
