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
} from 'lucide-react';

export function getWeatherIconComponent(iconName, size = 32, strokeWidth = 1.5, className = '') {
  switch (iconName) {
    case 'clear-day':
      return <Sun size={size} strokeWidth={strokeWidth} color="var(--yellow)" className={`weather-icon ${className}`} />;
    case 'clear-night':
      return <Moon size={size} strokeWidth={strokeWidth} color="var(--indigo)" className={`weather-icon ${className}`} />;
    case 'partly-cloudy-day':
      return <CloudSun size={size} strokeWidth={strokeWidth} color="var(--orange)" className={`weather-icon ${className}`} />;
    case 'partly-cloudy-night':
      return <CloudMoon size={size} strokeWidth={strokeWidth} color="var(--indigo)" className={`weather-icon ${className}`} />;
    case 'cloudy':
      return <Cloud size={size} strokeWidth={strokeWidth} color="var(--gray-2)" className={`weather-icon ${className}`} />;
    case 'fog':
      return <CloudFog size={size} strokeWidth={strokeWidth} color="var(--gray-1)" className={`weather-icon ${className}`} />;
    case 'drizzle':
      return <CloudDrizzle size={size} strokeWidth={strokeWidth} color="var(--sky)" className={`weather-icon ${className}`} />;
    case 'rain':
    case 'rain-shower':
      return <CloudRain size={size} strokeWidth={strokeWidth} color="var(--blue-2)" className={`weather-icon ${className}`} />;
    case 'heavy-rain':
    case 'thunderstorm-rain':
      return <CloudRain size={size} strokeWidth={strokeWidth} color="var(--blue)" className={`weather-icon ${className}`} />;
    case 'sleet':
      return <CloudHail size={size} strokeWidth={strokeWidth} color="var(--sky)" className={`weather-icon ${className}`} />;
    case 'snow':
    case 'snow-shower':
    case 'heavy-snow':
      return <CloudSnow size={size} strokeWidth={strokeWidth} color="var(--sky)" className={`weather-icon ${className}`} />;
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return <CloudLightning size={size} strokeWidth={strokeWidth} color="var(--yellow)" className={`weather-icon ${className}`} />;
    default:
      return <Cloud size={size} strokeWidth={strokeWidth} color="var(--gray-2)" className={`weather-icon ${className}`} />;
  }
}
