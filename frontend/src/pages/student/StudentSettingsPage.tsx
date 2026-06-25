// src/components/Settings.tsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Clock, Moon, Sun, Bell, Shield, Info } from 'lucide-react';
// Assuming useLocalStorage is in src/hooks/useLocalStorage.ts
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SettingsProps {
  darkMode: boolean;
  onThemeToggle: () => void; // Prop to toggle theme from parent
  onResetDataRequest: () => void; // New prop to request reset confirmation
}

export function Settings({ darkMode, onThemeToggle, onResetDataRequest }: SettingsProps) {
  const [dailyLimit, setDailyLimit] = useLocalStorage('dailyLimit', 120); // minutes
  // We'll use the darkMode prop directly from the parent, so no local state for it here
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [tempLimit, setTempLimit] = useState(dailyLimit.toString());

  const handleSaveLimit = () => {
    const newLimit = parseInt(tempLimit);
    if (newLimit > 0 && newLimit <= 1440) { // Max 24 hours
      setDailyLimit(newLimit);
    }
  };

  // Call the prop function to trigger confirmation in parent
  const handleResetDataClick = () => {
    onResetDataRequest();
  };

  // Tailwind classes for dynamic theming
  const bgColor = darkMode ? 'bg-gray-800/50' : 'bg-white/10';
  const borderColor = darkMode ? 'border-gray-700/50' : 'border-white/20';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textMutedColor = darkMode ? 'text-white/70' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-white/10';
  const inputBorder = darkMode ? 'border-gray-600' : 'border-white/20';
  const inputTextColor = darkMode ? 'text-white' : 'text-gray-800';
  const inputPlaceholderColor = darkMode ? 'placeholder-white/50' : 'placeholder-gray-400';

  return (
    <div className={`${bgColor} backdrop-blur-lg rounded-2xl shadow-2xl p-8 ${borderColor} relative overflow-hidden ${textColor}`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
      
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <SettingsIcon className="w-7 h-7 text-white" />
        </div>
        <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Settings
        </span>
      </h2>

      <div className="space-y-6">
        {/* Daily Usage Limit */}
        <div className={`p-6 ${darkMode ? 'bg-gray-700/20' : 'bg-white/5'} ${borderColor} rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-xl font-semibold ${textColor}`}>Daily Usage Limit</h3>
          </div>
          <p className={`${textMutedColor} text-sm mb-4`}>
            Set a daily time limit to help manage your usage. You'll receive warnings when approaching or exceeding this limit.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              min="1"
              max="1440"
              className={`w-24 px-4 py-2 ${inputBg} ${inputBorder} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputTextColor} backdrop-blur-sm ${inputPlaceholderColor}`}
            />
            <span className={`${textMutedColor} font-medium`}>minutes</span>
            <button
              onClick={handleSaveLimit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Save
            </button>
          </div>
          <p className={`text-sm ${textMutedColor} mt-3`}>
            Current limit: {dailyLimit} minutes ({Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m)
          </p>
        </div>

        {/* Notifications */}
        <div className={`p-6 ${darkMode ? 'bg-gray-700/20' : 'bg-white/5'} ${borderColor} rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${textColor}`}>Notifications</h3>
                <p className={`${textMutedColor} text-sm`}>
                  Receive notifications when you exceed your daily limit
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                notifications ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className={`p-6 ${darkMode ? 'bg-gray-700/20' : 'bg-white/5'} ${borderColor} rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                {darkMode ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : (
                  <Sun className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${textColor}`}>Dark Mode</h3>
                <p className={`${textMutedColor} text-sm`}>
                  Toggle between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={onThemeToggle} // Use the prop to toggle theme
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                darkMode ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 bg-red-500/10 border border-red-400/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-red-300">Data Management</h3>
          </div>
          <p className="text-red-200 text-sm mb-4">
            Reset all usage data and start fresh. This action cannot be undone.
          </p>
          <button
            onClick={handleResetDataClick} // Use the new handler
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Reset All Data
          </button>
        </div>

        {/* App Info */}
        <div className={`p-6 ${darkMode ? 'bg-gray-700/20' : 'bg-white/5'} ${borderColor} rounded-2xl backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-xl font-semibold ${textColor}`}>App Information</h3>
          </div>
          <div className={`text-sm ${textMutedColor} space-y-2`}>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Data Storage:</strong> Local Browser Storage</p>
            <p><strong>Privacy:</strong> All data stays on your device</p>
          </div>
        </div>
      </div>
    </div>
  );
}