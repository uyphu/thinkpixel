import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AlgorithmGrid from "../components/AlgorithmGrid";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 pt-20"> {/* 👈 Add padding-top here */}
        <HeroSection />
        <AlgorithmGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
