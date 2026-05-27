import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ onLogin, theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { width: screenWidth } = useWindowDimensions();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor, rellena todos los campos.');
      return;
    }
    // Aquí iría tu lógica de autenticación real. 
    // Por ahora, simulamos un login correcto:
    onLogin();
  };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      {/* Logotipo / Icono Principal */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🧊</Text>
        <Text style={[styles.logoText, { color: theme.text }]}>MERCADONA</Text>
        <Text style={[styles.logoSub, { color: theme.textSecondary }]}>
          Tu nevera inteligente y control de calorías
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Correo Electrónico</Text>
        <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}>Contraseña</Text>
        <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
            <Ionicons 
              name={secureText ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={theme.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Botón de Entrada */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.accent }]} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Registro falso / decorativo */}
        <TouchableOpacity style={styles.registerLink}>
          <Text style={{ color: theme.accent, textAlign: 'center', fontSize: 14 }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
  },
});