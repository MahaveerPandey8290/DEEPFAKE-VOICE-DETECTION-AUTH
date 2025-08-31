import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Download, Eye, Filter, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Results: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const results = [
    {
      id: 1,
      filename: 'interview_sample.wav',
      result: 'authentic',
      confidence: 98.7,
      duration: '2:45',
      size: '3.2 MB',
      analyzed: '2 hours ago',
      details: {
        method: 'Neural Network Analysis',
        processingTime: '1.2s',
        algorithms: ['Spectral Analysis', 'Temporal Patterns', 'Voice Biometrics']
      }
    },
    {
      id: 2,
      filename: 'phone_call_recording.mp3',
      result: 'deepfake',
      confidence: 92.3,
      duration: '5:12',
      size: '4.8 MB',
      analyzed: '1 day ago',
      details: {
        method: 'Advanced Deep Learning',
        processingTime: '2.8s',
        algorithms: ['Frequency Analysis', 'Pattern Recognition', 'Audio Fingerprinting']
      }
    },
    {
      id: 3,
      filename: 'voice_memo.wav',
      result: 'suspicious',
      confidence: 76.4,
      duration: '1:23',
      size: '1.5 MB',
      analyzed: '3 days ago',
      details: {
        method: 'Hybrid Analysis',
        processingTime: '0.9s',
        algorithms: ['Mel-Frequency', 'Cepstral Coefficients', 'Machine Learning']
      }
    },
    {
      id: 4,
      filename: 'presentation_audio.mp3',
      result: 'authentic',
      confidence: 95.1,
      duration: '12:34',
      size: '11.2 MB',
      analyzed: '1 week ago',
      details: {
        method: 'Multi-Modal Analysis',
        processingTime: '4.1s',
        algorithms: ['Prosodic Features', 'Spectral Density', 'Neural Networks']
      }
    }
  ];

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'authentic': return CheckCircle;
      case 'deepfake': return XCircle;
      case 'suspicious': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'authentic': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'deepfake': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'suspicious': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'from-green-500 to-emerald-500';
    if (confidence >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const filteredResults = results.filter(result => {
    const matchesFilter = selectedFilter === 'all' || result.result === selectedFilter;
    const matchesSearch = result.filename.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: results.length,
    authentic: results.filter(r => r.result === 'authentic').length,
    deepfake: results.filter(r => r.result === 'deepfake').length,
    suspicious: results.filter(r => r.result === 'suspicious').length,
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
        <p className="text-gray-300">View and manage your deepfake detection results</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-gray-400 text-sm">Total Analyzed</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stats.authentic}</p>
              <p className="text-gray-400 text-sm">Authentic</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{stats.deepfake}</p>
              <p className="text-gray-400 text-sm">Deepfakes</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.suspicious}</p>
              <p className="text-gray-400 text-sm">Suspicious</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                {['all', 'authentic', 'deepfake', 'suspicious'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg border ${getResultColor(result.result)}`}>
                    {React.createElement(getResultIcon(result.result), { 
                      className: "w-5 h-5" 
                    })}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{result.filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{result.duration}</span>
                      <span>{result.size}</span>
                      <span>{result.analyzed}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className={`text-sm font-medium capitalize ${
                      result.result === 'authentic' ? 'text-green-400' :
                      result.result === 'deepfake' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {result.result}
                    </p>
                    <p className="text-xs text-gray-400">
                      {result.confidence.toFixed(1)}% confidence
                    </p>
                  </div>

                  <div className="w-24">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceColor(result.confidence)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Info */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Detection Method</p>
                    <p className="text-white">{result.details.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Processing Time</p>
                    <p className="text-white">{result.details.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Algorithms Used</p>
                    <div className="flex flex-wrap gap-1">
                      {result.details.algorithms.map((algo, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Results;