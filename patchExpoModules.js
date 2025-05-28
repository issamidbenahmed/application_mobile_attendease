// This file patches the expo-modules-core to prevent errors on native platforms
import { Platform } from 'react-native';

// Only apply the patch if we're on a native platform
if (Platform.OS !== 'web') {
  // Mock the problematic function
  try {
    const expoModulesCore = require('expo-modules-core');
    if (!expoModulesCore.requireOptionalNativeModule) {
      expoModulesCore.requireOptionalNativeModule = function(name) {
        console.warn(`[PATCHED] Optional native module ${name} was requested but not available`);
        return null;
      };
      console.log('[PATCHED] Successfully patched expo-modules-core');
    }
  } catch (e) {
    console.warn('Failed to patch expo-modules-core:', e);
  }
}
