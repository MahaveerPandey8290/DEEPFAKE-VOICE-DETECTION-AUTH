import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Send } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../contexts/NotificationContext';

const RecordAudio: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up audio analysis for waveform
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Start waveform animation
      const updateWaveform = () => {
        if (analyserRef.current && isRecording) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const normalizedData = Array.from(dataArray.slice(0, 20)).map(value => value / 255);
          setWaveformData(normalizedData);
          
          requestAnimationFrame(updateWaveform);
        }
      };
      updateWaveform();

      showNotification({
        type: 'success',
        message: 'Recording started'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Failed to access microphone'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      setWaveformData([]);
      showNotification({
        type: 'info',
        message: 'Recording stopped'
      });
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setIsPlaying(false);
    setWaveformData([]);
    
    showNotification({
      type: 'info',
      message: 'Recording reset'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitForAnalysis = () => {
    if (!audioBlob) return;
    
    showNotification({
      type: 'success',
      message: 'Audio submitted for analysis!'
    });
    
    // Here you would typically upload the audio file
    // For demo purposes, we'll just show a success message
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Record Audio</h1>
        <p className="text-gray-300">Record audio directly for real-time deepfake detection</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="text-center space-y-6">
              {/* Timer */}
              <div className="text-4xl font-mono text-white">
                {formatTime(duration)}
              </div>

              {/* Waveform Visualization */}
              <div className="h-20 flex items-end justify-center space-x-1">
                {isRecording ? (
                  waveformData.map((value, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-indigo-500 to-purple-500 w-2 rounded-full"
                      animate={{ height: Math.max(4, value * 60) }}
                      transition={{ duration: 0.1 }}
                    />
                  ))
                ) : (
                  Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-600 w-2 h-1 rounded-full"
                    />
                  ))
                )}
              </div>

              {/* Recording Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isRecording ? { 
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                    ]
                  } : {}}
                  transition={isRecording ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut'
                  } : { duration: 0.2 }}
                >
                  {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </motion.button>
              </div>

              <p className="text-gray-400">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Playback & Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Playback & Analysis</h3>
            
            <AnimatePresence>
              {audioUrl ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <audio 
                    src={audioUrl} 
                    controls 
                    className="w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={resetRecording}
                      variant="secondary"
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={submitForAnalysis}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recording available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start recording to see playback controls
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recording Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio Quality
                </label>
                <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="high">High Quality (48kHz)</option>
                  <option value="medium">Medium Quality (44.1kHz)</option>
                  <option value="low">Low Quality (22kHz)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto Stop After
                </label>
                <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="none">No limit</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="noise-reduction" className="rounded" />
                <label htmlFor="noise-reduction" className="text-sm text-gray-300">
                  Enable noise reduction
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="real-time-analysis" className="rounded" />
                <label htmlFor="real-time-analysis" className="text-sm text-gray-300">
                  Real-time analysis during recording
                </label>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RecordAudio;