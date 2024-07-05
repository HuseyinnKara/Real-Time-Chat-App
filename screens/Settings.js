import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Settings = ({ navigation }) => {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = () => {
    if (displayName !== '') {
      updateProfile(auth.currentUser, { displayName })
        .then(() => {
          Alert.alert('Başarılı', 'Profil güncellendi');
        })
        .catch(error => Alert.alert('Hata', error.message));
    }
  };

  const handleChangePassword = () => {
    if (password === confirmPassword) {
      updatePassword(auth.currentUser, password)
        .then(() => {
          Alert.alert('Başarılı', 'Şifre güncellendi');
        })
        .catch(error => Alert.alert('Hata', error.message));
    } else {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Görünen Ad"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Profili Güncelle</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifreyi Onayla"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#F6F7FB',
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#6200ea',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
});