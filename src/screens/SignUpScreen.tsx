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
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { authService } from '../lib/api';

// Types pour la navigation
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation de base
    if (!nom || !prenom || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Tentative d\'inscription...');
      // Les champs attendus par l'API: name, email, password, password_confirmation
      const userData = {
        name: `${prenom} ${nom}`, // Le backend attend un seul champ name
        email,
        password,
        password_confirmation: confirmPassword
      };
      
      const response = await authService.register(userData);
      console.log('Réponse d\'inscription:', response);
      
      setIsLoading(false);
      
      // Redirection directe vers l'écran de connexion
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.message);
      if (error.response) {
        console.error('Détails erreur:', error.response.data);
      }
      
      setIsLoading(false);
      
      // Afficher les erreurs
      const errorMessage = error.response?.data?.message || 
                          'Erreur lors de l\'inscription. Veuillez réessayer.';
      Alert.alert('Erreur', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Image 
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Contrôle d'absence</Text>
              <Text style={styles.description}>Créez un compte pour gérer les présences</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  value={nom}
                  onChangeText={setNom}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre prénom"
                  value={prenom}
                  onChangeText={setPrenom}
                  editable={!isLoading}
                />
              </View>

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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmez votre mot de passe"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.signinText}>
                Vous avez déjà un compte ?{' '}
                <Text 
                  style={styles.signinLink}
                  onPress={() => navigation.navigate('SignIn')}
                >
                  Connectez-vous
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-secondary
    padding: 16,
  },
  keyboardAvoidView: {
    flex: 1,
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
    marginBottom: 24,
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
    textAlign: 'center',
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
  signinText: {
    fontSize: 12,
    color: '#6B7280', // text-muted-foreground
  },
  signinLink: {
    color: '#7C3AED', // text-accent
    textDecorationLine: 'underline',
  },
}); 