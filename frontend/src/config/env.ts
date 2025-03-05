import Constants from 'expo-constants';

const ENV = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: 'https://api.bejiujitsu.com' // Update this with your production URL
  }
} as const;

export type Environment = {
  API_URL: string;
}

export default function getEnvVars(): Environment {
  if (__DEV__) {
    console.log('Using development environment');
    return ENV.development;
  }
  console.log('Using production environment');
  return ENV.production;
}

// Export commonly used values directly
export const API_URL = getEnvVars().API_URL;
