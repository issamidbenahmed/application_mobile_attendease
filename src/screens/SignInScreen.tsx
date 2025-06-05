import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert,
  Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { authService } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour la navigation
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre email et mot de passe');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Tentative de connexion avec:', { email });
      const response = await authService.login({ email, password });
      console.log('Réponse de connexion:', response);

      // Stocker le nom de l'utilisateur connecté dans AsyncStorage
      if (response && response.user && response.user.name) {
        await AsyncStorage.setItem('loggedInUserName', response.user.name);
      } else if (response && response.name) {
        await AsyncStorage.setItem('loggedInUserName', response.name);
      }
      setIsLoading(false);

      // Forcer la navigation vers Main
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      console.error('Erreur de connexion:', error.message);
      if (error.response) {
        console.error('Détails erreur:', error.response.data);
      }
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || 'Erreur de connexion au serveur';
      Alert.alert('Erreur de connexion', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Contrôle d'absence</Text>
            <Text style={styles.description}>Connectez-vous pour gérer les présences</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="m@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Vous n'avez pas de compte ?{' '}
              <Text 
                style={styles.signupLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                Inscrivez-vous
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-secondary
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardAvoidView: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED', // text-primary (purple)
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280', // text-muted-foreground
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151', // text-foreground
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // border
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#7C3AED', // bg-primary (purple)
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  signupText: {
    fontSize: 12,
    color: '#6B7280', // text-muted-foreground
  },
  signupLink: {
    color: '#7C3AED', // text-accent
    textDecorationLine: 'underline',
  },
}); 