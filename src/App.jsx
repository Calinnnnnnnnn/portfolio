import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import './App.css';
import AboutMe from './components/AboutMe/AboutMe';
import ProjectsShowcase from './components/ProjectsShowcase/ProjectsShowcase';
import ContactSection from './components/Contact/ContactSection';
import ContactIntro from './components/ContactIntro/ContactIntro';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <AboutMe />
      <ProjectsShowcase />
      <ContactIntro />
      <ContactSection />
      <Footer />
      </div>
  );
}

export default App;
