import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Upload, Mic, Radio } from 'lucide-react';
import Card from '../components/Card';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Detections', value: '1,234', change: '+12%', icon: Shield, color: 'from-blue-500 to-cyan-500' },
    { name: 'Authentic Audio', value: '987', change: '+8%', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { name: 'Deepfakes Detected', value: '247', change: '+15%', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
    { name: 'Accuracy Rate', value: '98.7%', change: '+0.3%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  const chartData = [
    { name: 'Mon', authentic: 45, deepfake: 12 },
    { name: 'Tue', authentic: 52, deepfake: 8 },
    { name: 'Wed', authentic: 38, deepfake: 15 },
    { name: 'Thu', authentic: 67, deepfake: 10 },
    { name: 'Fri', authentic: 72, deepfake: 6 },
    { name: 'Sat', authentic: 41, deepfake: 9 },
    { name: 'Sun', authentic: 55, deepfake: 14 },
  ];

  const pieData = [
    { name: 'Authentic', value: 80, color: '#10b981' },
    { name: 'Deepfake', value: 20, color: '#ef4444' },
  ];

  const recentDetections = [
    { id: 1, filename: 'voice_sample_001.wav', result: 'Authentic', confidence: 99.2, time: '2 min ago' },
    { id: 2, filename: 'interview_audio.mp3', result: 'Deepfake', confidence: 87.5, time: '15 min ago' },
    { id: 3, filename: 'phone_call.wav', result: 'Authentic', confidence: 95.8, time: '1 hour ago' },
    { id: 4, filename: 'meeting_record.mp3', result: 'Authentic', confidence: 98.1, time: '2 hours ago' },
  ];

  const quickActions = [
    { name: 'Upload Audio', icon: Upload, href: '/upload', color: 'from-indigo-500 to-purple-500' },
    { name: 'Record Audio', icon: Mic, href: '/record', color: 'from-green-500 to-teal-500' },
    { name: 'Live Detection', icon: Radio, href: '/live', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Overview of your deepfake detection analytics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card gradient>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.change} from last week</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Detection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                    border: '1px solid rgba(55, 65, 81, 0.7)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="authentic" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="deepfake" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Detection Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Detections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.name}
                  href={action.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.name}</span>
                </motion.a>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Detections</h3>
            <div className="space-y-3">
              {recentDetections.map((detection, index) => (
                <motion.div
                  key={detection.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      detection.result === 'Authentic' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-white font-medium">{detection.filename}</p>
                      <p className="text-gray-400 text-sm">{detection.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      detection.result === 'Authentic' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {detection.result}
                    </p>
                    <p className="text-gray-400 text-sm">{detection.confidence}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;