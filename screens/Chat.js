import React, { useState, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function Chat() {

    const [messages, setMessages] = useState([]);
    const [chatTitle, setChatTitle] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId } = route.params;

    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={onSignOut}
                >
                    <AntDesign name="logout" size={24} color='#FFF' />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                color: '#FFF',
            },
            headerStyle: {
                backgroundColor: '#6200ea',
            },
            title: chatTitle || 'Sohbet',
        });
    }, [navigation, chatTitle]);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats', chatId, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log('querySnapshot unsubscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: {
                        ...doc.data().user,
                        initials: doc.data().user.initials
                    },
                    docId: doc.id,
                }))
            );
        });

        const chatDocRef = doc(database, 'chats', chatId);
        getDoc(chatDocRef).then((doc) => {
            if (doc.exists()) {
                setChatTitle(doc.data().title);
            }
        });

        return unsubscribe;
    }, [chatId]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];
        const displayName = user.displayName || "Anonymous";
        const initials = displayName.split(" ").map((name) => name[0]).join("");

        const messageData = {
            _id,
            createdAt,
            text,
            user: {
                ...user,
                initials: initials || "NN",
            }
        };

        addDoc(collection(database, 'chats', chatId, 'messages'), messageData);

        if (!chatTitle) {
            updateDoc(doc(database, 'chats', chatId), {
                title: text
            });
            setChatTitle(text);
        }
    }, [chatId, chatTitle]);

    const deleteMessage = async (messageId, docId) => {
        const user = auth.currentUser;
        if (user) {
            await deleteDoc(doc(database, 'chats', chatId, 'messages', docId));
            setMessages((previousMessages) => previousMessages.filter(message => message._id !== messageId));
        }
    };

    const handleLongPress = (context, message) => {
        const user = auth.currentUser;
        if (message.user._id === user.email) {
            Alert.alert(
                'Mesajı Sil',
                'Bu mesajı silmek istediğinizden emin misiniz?',
                [
                    {
                        text: 'İptal',
                        style: 'cancel',
                    },
                    {
                        text: 'Sil',
                        onPress: () => deleteMessage(message._id, message.docId),
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#6200ea',
                    },
                    left: {
                        backgroundColor: '#e0e0e0',
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                    left: {
                        color: '#000',
                    }
                }}
                onLongPress={handleLongPress}
            />
        );
    };

    const renderAvatar = (props) => {
        const { user } = props.currentMessage;
        return (
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                    {user.initials}
                </Text>
            </View>
        );
    };

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            onSend={messages => onSend(messages)}
            messagesContainerStyle={styles.messagesContainer}
            textInputStyle={styles.textInput}
            user={{
                _id: auth?.currentUser?.email,
                displayName: auth?.currentUser?.displayName
            }}
        />
    );
}

const styles = StyleSheet.create({
    signOutButton: {
        marginRight: 10,
    },
    avatarContainer: {
        backgroundColor: '#6200ea',
        borderRadius: 15,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    messagesContainer: {
        backgroundColor: '#fff',
    },
    textInput: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
    },
});