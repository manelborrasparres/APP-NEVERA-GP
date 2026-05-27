import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

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
    onLogin();
  };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={styles.logoContainer}>
        {/* LOGOTIPO CORPORATIVO MERCADONA */}
        <View style={[styles.logoMercadonaGrande, { backgroundColor: '#005e3a' }]}>
          <FontAwesome5 name="shopping-basket" size={36} color="#FFFFFF" />
        </View>
        <Text style={[styles.logoText, { color: theme.text }]}>MERCADONA</Text>
        <Text style={[styles.logoSub, { color: theme.textSecondary }]}>Tu nevera inteligente y control de calorías</Text>
      </View>

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
            <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.orange }]} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoMercadonaGrande: {
    width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center',
    borderWidth: 5, borderColor: '#ff6600', marginBottom: 16, elevation: 4
  },
  logoText: { fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  logoSub: { fontSize: 13, marginTop: 6, textAlign: 'center' },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, height: 50, paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 15 },
  eyeIcon: { padding: 4 },
  button: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32, elevation: 2 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});