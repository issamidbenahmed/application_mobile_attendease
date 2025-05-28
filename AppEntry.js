/**
 * Custom entry point for the Attendease app
 * This file ensures proper registration for both web and native platforms
 */
import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Ensure the app is registered with AppRegistry for native platforms
if (Platform.OS !== 'web') {
  console.log('Registering app for native platform');
  
  // Register the app with React Native's AppRegistry
  if (!AppRegistry.getAppKeys().includes('main')) {
    AppRegistry.registerComponent('main', () => App);
  }
}

// Register with Expo's root component system (works for both web and native)
registerRootComponent(App);

export default App;
