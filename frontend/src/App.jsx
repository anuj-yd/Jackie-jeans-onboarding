import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { Landing } from './pages/Landing';
import { ManualQuiz } from './pages/ManualQuiz';
import { VoiceQuiz } from './pages/VoiceQuiz';
import { Completion } from './pages/Completion';

function App() {
  return (
    <OnboardingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/manual" element={<ManualQuiz />} />
          <Route path="/voice" element={<VoiceQuiz />} />
          <Route path="/completion" element={<Completion />} />
        </Routes>
      </Router>
    </OnboardingProvider>
  );
}

export default App;
