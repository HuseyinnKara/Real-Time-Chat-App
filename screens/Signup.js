import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
const backImage = require("../assets/chatbubles5.png");

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const onHandleSignup = () => {
        if (email !== '' && password !== '' && firstName !== '' && lastName !== '') {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(user, {
                        displayName: `${firstName} ${lastName}`,
                    })
                        .then(() => {
                            console.log('Signup success');
                        })
                        .catch((err) => Alert.alert("Profile update error", err.message));
                })
                .catch((err) => Alert.alert("Signup error", err.message));
        } else {
            Alert.alert("Signup error", "All fields are required.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={backImage} style={styles.backImage} />
            <View style={styles.overlay} />
            <View style={styles.whiteSheet} />
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Kayıt Ol </Text>
                <TextInput
                    style={styles.input}
                    placeholder="İsim"
                    placeholderTextColor="#aaaaaa"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Soy İsim"
                    placeholderTextColor="#aaaaaa"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaaaaa"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="#aaaaaa"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}> Zaten üye misiniz? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.footerLink}>Giriş Yapın</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <StatusBar barStyle="light-content" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: "#6200ea",
        alignSelf: "center",
        paddingBottom: 24,
    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    backImage: {
        width: "100%",
        height: 340,
        position: "absolute",
        top: 0,
        resizeMode: 'cover',
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 340,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    whiteSheet: {
        width: '100%',
        height: '75%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: '#6200ea',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
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
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    footerText: {
        color: 'gray',
        fontWeight: '600',
        fontSize: 14,
    },
    footerLink: {
        color: '#6200ea',
        fontWeight: '600',
        fontSize: 14,
    },
});