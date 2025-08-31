import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Shield, User, Volume2, Eye, Database } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { showNotification } = useNotification();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      detection: true,
      security: false,
    },
    privacy: {
      analytics: true,
      dataSharing: false,
      publicProfile: false,
    },
    detection: {
      sensitivity: 75,
      autoAnalysis: true,
      realTimePreview: true,
      saveResults: true,
    },
    audio: {
      quality: 'high',
      noiseReduction: true,
      autoGain: false,
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    showNotification({
      type: 'success',
      message: 'Settings saved successfully'
    });
  };

  const resetSettings = () => {
    showNotification({
      type: 'info',
      message: 'Settings reset to defaults'
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300">Customize your DeepGuard experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme & Appearance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Theme & Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Switch between light and dark themes</p>
                </div>
                <motion.button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isDark ? 'bg-indigo-500' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                    animate={{ x: isDark ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  </motion.div>
                </motion.button>
              </div>

              <div>
                <p className="text-white font-medium mb-2">Interface Scale</p>
                <div className="flex space-x-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        size === 'Medium'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {key === 'email' && 'Receive email notifications'}
                      {key === 'push' && 'Browser push notifications'}
                      {key === 'detection' && 'Alert on deepfake detection'}
                      {key === 'security' && 'Security-related alerts'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      value ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                      animate={{ x: value ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Detection Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Detection Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">Detection Sensitivity</p>
                  <span className="text-sm text-gray-400">{settings.detection.sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.detection.sensitivity}
                  onChange={(e) => handleSettingChange('detection', 'sensitivity', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {['autoAnalysis', 'realTimePreview', 'saveResults'].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-400">
                      {setting === 'autoAnalysis' && 'Automatically analyze uploaded files'}
                      {setting === 'realTimePreview' && 'Show detection preview during analysis'}
                      {setting === 'saveResults' && 'Save detection results to history'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('detection', setting, !settings.detection[setting as keyof typeof settings.detection])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.detection[setting as keyof typeof settings.detection] ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                      animate={{ x: settings.detection[setting as keyof typeof settings.detection] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Audio Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Audio Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white font-medium mb-2">Audio Quality</p>
                <select 
                  value={settings.audio.quality}
                  onChange={(e) => handleSettingChange('audio', 'quality', e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="low">Low (22kHz)</option>
                  <option value="medium">Medium (44.1kHz)</option>
                  <option value="high">High (48kHz)</option>
                </select>
              </div>

              {['noiseReduction', 'autoGain'].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-400">
                      {setting === 'noiseReduction' && 'Reduce background noise during recording'}
                      {setting === 'autoGain' && 'Automatically adjust microphone levels'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('audio', setting, !settings.audio[setting as keyof typeof settings.audio])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.audio[setting as keyof typeof settings.audio] ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                      animate={{ x: settings.audio[setting as keyof typeof settings.audio] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Privacy & Data</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-400">
                      {key === 'analytics' && 'Help improve the service with usage analytics'}
                      {key === 'dataSharing' && 'Share anonymized data for research'}
                      {key === 'publicProfile' && 'Make your profile visible to others'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('privacy', key, !value)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      value ? 'bg-indigo-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                      animate={{ x: value ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 font-medium mb-1">Storage Used</p>
                <p className="text-white text-sm">2.4 GB of 10 GB used</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  Export Detection History
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  Download Personal Data
                </Button>
                <Button variant="danger" className="w-full justify-start">
                  Delete All Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-end space-x-4"
      >
        <Button variant="secondary" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={saveSettings}>
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;