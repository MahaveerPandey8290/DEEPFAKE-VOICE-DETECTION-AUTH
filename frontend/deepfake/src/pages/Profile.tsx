import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Shield, Calendar, Award, Settings, Edit } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../contexts/NotificationContext';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Security Analyst',
    joinDate: '2023-01-15',
    avatar: null as string | null
  });

  const { showNotification } = useNotification();

  const stats = [
    { label: 'Total Analyses', value: '1,247', icon: Shield, color: 'from-blue-500 to-cyan-500' },
    { label: 'Deepfakes Detected', value: '89', icon: Award, color: 'from-red-500 to-rose-500' },
    { label: 'Accuracy Rate', value: '98.7%', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Days', value: '156', icon: Calendar, color: 'from-purple-500 to-pink-500' },
  ];

  const recentActivity = [
    { date: '2024-01-15', action: 'Analyzed audio file', file: 'interview_001.wav', result: 'Authentic' },
    { date: '2024-01-14', action: 'Live detection session', file: 'meeting_audio.mp3', result: 'Deepfake' },
    { date: '2024-01-13', action: 'Uploaded batch files', file: '5 files processed', result: 'Mixed' },
    { date: '2024-01-12', action: 'Profile settings updated', file: 'Security preferences', result: 'Success' },
  ];

  const achievements = [
    { name: 'First Detection', description: 'Completed your first deepfake analysis', earned: true },
    { name: 'Sharp Eye', description: 'Detected 50 deepfakes with 95%+ accuracy', earned: true },
    { name: 'Speed Demon', description: 'Processed 100 files in a single day', earned: true },
    { name: 'Guardian', description: 'Prevented potential fraud through detection', earned: false },
    { name: 'Expert Analyst', description: 'Achieved 99% average accuracy rate', earned: false },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    showNotification({
      type: 'success',
      message: 'Profile updated successfully'
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-300">Manage your account and view your detection history</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-white/10 backdrop-blur-lg rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden" 
                  />
                </label>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                  />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                      Save
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)} 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                  <p className="text-gray-400">{profile.email}</p>
                  <p className="text-sm text-gray-500 mt-1">{profile.role}</p>
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="secondary" 
                    size="sm" 
                    className="mt-3"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.file}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        activity.result === 'Authentic' ? 'text-green-400' :
                        activity.result === 'Deepfake' ? 'text-red-400' : 
                        activity.result === 'Success' ? 'text-blue-400' : 'text-yellow-400'
                      }`}>
                        {activity.result}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                    : 'bg-white/5 border-gray-500/30'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Award className={`w-6 h-6 ${
                    achievement.earned ? 'text-yellow-400' : 'text-gray-500'
                  }`} />
                  <h4 className={`font-medium ${
                    achievement.earned ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h4>
                </div>
                <p className={`text-sm ${
                  achievement.earned ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;