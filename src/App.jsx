import Navbar from "./layout/NavBar";
import Hero from "./components/Hero";
import EventTypes from "./components/EventTypes";
import Services from "./components/Services";
import Contact from "./components/Contact";
import ChatWidget from "./components/ChatWidget";
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <EventTypes />
      <Services/>
      <Contact />
      <ChatWidget />
    </div>
  );
}
