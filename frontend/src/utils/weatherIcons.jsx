import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
  Wind,
} from 'lucide-react';

export function getWeatherIconComponent(iconName, size = 28, className = '') {
  switch (iconName) {
    case 'clear-day':
      return <Sun size={size} className={`text-amber-500 ${className}`} color="#f59e0b" />;
    case 'clear-night':
      return <Moon size={size} className={`text-indigo-400 ${className}`} color="#818cf8" />;
    case 'partly-cloudy-day':
      return <CloudSun size={size} className={`text-amber-400 ${className}`} color="#fbbf24" />;
    case 'partly-cloudy-night':
      return <CloudMoon size={size} className={`text-indigo-300 ${className}`} color="#a5b4fc" />;
    case 'cloudy':
      return <Cloud size={size} className={`text-slate-400 ${className}`} color="#94a3b8" />;
    case 'fog':
      return <CloudFog size={size} className={`text-slate-300 ${className}`} color="#cbd5e1" />;
    case 'drizzle':
      return <CloudDrizzle size={size} className={`text-sky-400 ${className}`} color="#38bdf8" />;
    case 'rain':
    case 'rain-shower':
      return <CloudRain size={size} className={`text-blue-500 ${className}`} color="#3b82f6" />;
    case 'heavy-rain':
    case 'thunderstorm-rain':
      return <CloudRain size={size} className={`text-blue-700 ${className}`} color="#1d4ed8" />;
    case 'sleet':
      return <CloudHail size={size} className={`text-cyan-400 ${className}`} color="#22d3ee" />;
    case 'snow':
    case 'snow-shower':
      return <CloudSnow size={size} className={`text-sky-200 ${className}`} color="#bae6fd" />;
    case 'heavy-snow':
      return <CloudSnow size={size} className={`text-indigo-100 ${className}`} color="#e0e7ff" />;
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return <CloudLightning size={size} className={`text-amber-400 ${className}`} color="#fbbf24" />;
    default:
      return <Cloud size={size} className={`text-slate-400 ${className}`} color="#94a3b8" />;
  }
}
