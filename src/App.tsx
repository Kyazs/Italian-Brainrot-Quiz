import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Footer } from "./components";
import FadeIn from './components/FadeIn';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { trackVisit } from './utils/supabaseClient';
import './index.scss';

function App() {
    const [mode, setMode] = useState<string>('dark');

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    useEffect(() => {
        // Track user visit when app loads
        trackVisit();
        
        // Scroll to top
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    return (
        <Router>
            <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <FadeIn transitionDuration={700}>
                    <Routes>
                        {/* Main component now renders at root path */}
                        <Route path="/" element={<Main />} />
                        {/* Keep the old route for compatibility with existing links */}
                        <Route path="/italian-brainrot-quiz" element={<Main />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/results" element={<Results />} />
                    </Routes>
                </FadeIn>
                <Footer />
            </div>
        </Router>
    );
}

export default App;