import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  Mic,
  Radio,
  FileSearch,
  User,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload Audio', href: '/upload', icon: Upload },
  { name: 'Record Audio', href: '/record', icon: Mic },
  { name: 'Live Detection', href: '/live', icon: Radio },
  { name: 'Results', href: '/results', icon: FileSearch },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-r border-white/20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        exit={{ x: -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-6 lg:hidden">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                  </motion.div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-indigo-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 border border-indigo-500/30">
            <h3 className="text-sm font-semibold text-white mb-2">Pro Features</h3>
            <p className="text-xs text-gray-300 mb-3">
              Upgrade to unlock advanced detection algorithms
            </p>
            <motion.button
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upgrade Now
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;