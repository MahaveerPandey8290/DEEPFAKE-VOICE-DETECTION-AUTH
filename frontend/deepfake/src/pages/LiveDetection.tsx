import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, RadioIcon, Play, Pause, AlertTriangle, CheckCircle, Volume2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../contexts/NotificationContext';

const LiveDetection: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<'authentic' | 'suspicious' | 'deepfake' | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(30).fill(0));
  const [alerts, setAlerts] = useState<Array<{ id: string; type: string; message: string; time: Date }>>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    return () => {
      stopLiveDetection();
    };
  }, []);

  const startLiveDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualization = () => {
        if (!analyserRef.current || !isLive) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Update audio level
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);

        // Update waveform
        const waveform = Array.from(dataArray.slice(0, 30)).map(value => value / 255);
        setWaveformData(waveform);

        // Simulate detection logic
        simulateDetection();

        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };

      setIsLive(true);
      updateVisualization();

      showNotification({
        type: 'success',
        message: 'Live detection started'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Failed to access microphone'
      });
    }
  };

  const stopLiveDetection = () => {
    setIsLive(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setDetectionStatus(null);
    setConfidence(0);
    setAudioLevel(0);
    setWaveformData(Array(30).fill(0));

    showNotification({
      type: 'info',
      message: 'Live detection stopped'
    });
  };

  const simulateDetection = () => {
    // Simulate AI detection with random results
    const random = Math.random();
    let status: 'authentic' | 'suspicious' | 'deepfake';
    let conf: number;

    if (random > 0.9) {
      status = 'deepfake';
      conf = 85 + Math.random() * 15;
      
      const alert = {
        id: Date.now().toString(),
        type: 'danger',
        message: 'Potential deepfake detected!',
        time: new Date()
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 4)]);
      
      showNotification({
        type: 'error',
        message: 'Deepfake detected!'
      });
    } else if (random > 0.7) {
      status = 'suspicious';
      conf = 60 + Math.random() * 25;
    } else {
      status = 'authentic';
      conf = 90 + Math.random() * 10;
    }

    setDetectionStatus(status);
    setConfidence(conf);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authentic': return 'from-green-500 to-emerald-500';
      case 'suspicious': return 'from-yellow-500 to-orange-500';
      case 'deepfake': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return CheckCircle;
      case 'suspicious': return AlertTriangle;
      case 'deepfake': return AlertTriangle;
      default: return Radio;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Live Detection</h1>
        <p className="text-gray-300">Real-time deepfake detection from microphone input</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Waveform */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Live Audio Stream</h3>
              <div className="flex items-center space-x-2">
                {isLive && (
                  <motion.div
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <span className="text-sm text-gray-400">
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-32 bg-black/20 rounded-lg p-4 mb-6">
              <div className="h-full flex items-end justify-center space-x-1">
                {waveformData.map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-t from-indigo-500 to-purple-500 w-2 rounded-full min-h-[4px]"
                    animate={{ height: Math.max(4, value * 100) }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </div>

            {/* Audio Level Meter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Audio Level</span>
                <span className="text-sm text-white">{Math.round(audioLevel * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                  animate={{ width: `${audioLevel * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Control Button */}
            <div className="text-center">
              <Button
                onClick={isLive ? stopLiveDetection : startLiveDetection}
                variant={isLive ? 'danger' : 'primary'}
                size="lg"
              >
                {isLive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Detection
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Detection Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Current Status */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Detection Status</h3>
            
            <AnimatePresence mode="wait">
              {detectionStatus ? (
                <motion.div
                  key={detectionStatus}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getStatusColor(detectionStatus)} flex items-center justify-center`}>
                    {React.createElement(getStatusIcon(detectionStatus), { 
                      className: "w-8 h-8 text-white" 
                    })}
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-white capitalize">
                      {detectionStatus}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Confidence: {confidence.toFixed(1)}%
                    </p>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(detectionStatus)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Radio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Waiting for audio...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start detection to see results
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Detection Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sensitivity
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  defaultValue="75"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-alerts" className="rounded" defaultChecked />
                <label htmlFor="auto-alerts" className="text-sm text-gray-300">
                  Auto alerts on detection
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="continuous" className="rounded" />
                <label htmlFor="continuous" className="text-sm text-gray-300">
                  Continuous monitoring
                </label>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <p className="text-gray-400 text-sm">
                        {alert.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-red-400 font-medium">HIGH</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default LiveDetection;