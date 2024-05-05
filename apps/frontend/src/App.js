import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LearnMorePage from './components/LearnMorePage';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/" element={<>
            <Hero />
            <Features />
            <Footer />
          </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;