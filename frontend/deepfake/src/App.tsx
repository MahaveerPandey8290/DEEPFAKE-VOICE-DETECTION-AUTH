import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UploadAudio from './pages/UploadAudio';
import RecordAudio from './pages/RecordAudio';
import LiveDetection from './pages/LiveDetection';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AnimatedBackground from './components/AnimatedBackground';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
            <AnimatedBackground />
            <Layout>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadAudio />} />
                  <Route path="/record" element={<RecordAudio />} />
                  <Route path="/live" element={<LiveDetection />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </motion.div>
            </Layout>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;