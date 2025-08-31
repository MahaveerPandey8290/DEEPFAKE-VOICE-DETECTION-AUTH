import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Play } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../contexts/NotificationContext';

interface UploadedFile {
  name: string;
  size: number;
  duration?: number;
  type: string;
}

const UploadAudio: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showNotification } = useNotification();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const audioFiles = Array.from(fileList).filter(file =>
      file.type.startsWith('audio/') ||
      file.name.toLowerCase().match(/\.(mp3|wav|m4a|aac|ogg|flac)$/)
    );

    if (audioFiles.length === 0) {
      showNotification({ type: 'error', message: 'Please upload valid audio files only' });
      return;
    }

    const newFiles: UploadedFile[] = audioFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'audio/unknown',
      duration: Math.floor(Math.random() * 180) + 30
    }));

    setFiles(prev => [...prev, ...newFiles]);
    showNotification({ type: 'success', message: `${audioFiles.length} file(s) uploaded successfully` });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🚀 Final version: Analysis & fetch integration
  const analyzeFiles = async () => {
    if (files.length === 0) {
      showNotification({
        type: 'warning',
        message: 'Please upload audio files first'
      });
      return;
    }

    const formData = new FormData();
    const rawFile = (document.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];

    if (!rawFile) {
      showNotification({ type: 'error', message: 'No valid file found for upload' });
      return;
    }

    formData.append('file', rawFile);

    try {
      setIsAnalyzing(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      const response = await fetch('http://127.0.0.1:8000/api/detect/', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setProgress(100);
      clearInterval(interval);
      setIsAnalyzing(false);

      showNotification({
        type: 'success',
        message: `Analysis Complete: ${data?.prediction || 'No response from model'}`
      });
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      showNotification({ type: 'error', message: 'Analysis failed' });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Upload Audio</h1>
        <p className="text-gray-300">Upload audio files to analyze for deepfake detection</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-indigo-400 bg-indigo-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div
                className="space-y-4"
                animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-white">
                    {dragActive ? 'Drop files here' : 'Drag & drop audio files'}
                  </p>
                  <p className="text-gray-400 mt-1">or click to browse</p>
                </div>
                <div className="text-sm text-gray-500">
                  Supports: MP3, WAV, M4A, AAC, OGG, FLAC (Max 100MB each)
                </div>
              </motion.div>
              <input
                type="file"
                multiple
                accept="audio/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {formatFileSize(file.size)} • {file.duration && formatDuration(file.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFile(index)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detection Sensitivity
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Low</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    defaultValue="75"
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Analysis Type
                </label>
                <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="standard">Standard Analysis</option>
                  <option value="deep">Deep Analysis</option>
                  <option value="quick">Quick Scan</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="realtime" className="rounded" />
                <label htmlFor="realtime" className="text-sm text-gray-300">
                  Enable real-time preview
                </label>
              </div>
            </div>

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
                  <span className="text-white font-medium">Analyzing audio files...</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% complete</p>
              </motion.div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button
                onClick={analyzeFiles}
                loading={isAnalyzing}
                disabled={files.length === 0}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadAudio;
