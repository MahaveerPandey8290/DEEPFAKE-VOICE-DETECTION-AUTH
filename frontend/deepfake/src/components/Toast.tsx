import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'from-emerald-500 to-green-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-lg bg-gradient-to-r ${colors[type]} max-w-sm`}
    >
      <Icon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
      <p className="text-white text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </motion.div>
  );
};

export default Toast;