import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Types pour la navigation
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

export type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>; 