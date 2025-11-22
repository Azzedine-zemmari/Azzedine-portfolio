import './App.css'
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SocialSidebar from './components/SocialSideBar';

// Custom scrollbar styles
const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 6px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
function App() {

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* Soft orange circle - top right - Fixed across entire page */}
        <div className="fixed -top-36 -right-20 w-64 h-64 md:w-96 md:h-96 bg-orange-200/30 rounded-full blur-3xl z-0"></div>

        {/* Soft green circle - bottom left - Fixed across entire page */}
        <div className="fixed -bottom-20 -left-20 w-56 h-56 md:w-80 md:h-80 bg-emerald-200/25 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10">
          <Header />
          <SocialSidebar />
          <HeroSection />
        </div>
      </div>
    </>
  )
}

export default App
