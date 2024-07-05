import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { database } from '../config/firebase';

const Home = () => {

    const [chats, setChats] = useState([]);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedChats, setSelectedChats] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                        <FontAwesome name="cog" size={24} color='#FFF' style={{ marginLeft: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
                        <FontAwesome name="search" size={24} color='#FFF' style={{ marginLeft: 15 }} />
                    </TouchableOpacity>
                    {searchVisible && (
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Sohbet Konusu Ara..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    )}
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => setDeleteMode(!deleteMode)}>
                        <AntDesign name="delete" size={24} color='#FFF' style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#6200ea',
            },
            headerTitleStyle: {
                color: '#FFF',
            }
        });
    }, [navigation, searchVisible, searchQuery, deleteMode]);

    useEffect(() => {
        const collectionRef = collection(database, 'chats');
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsubscribe;
    }, []);

    const createNewChat = async () => {
        const docRef = await addDoc(collection(database, 'chats'), {
            title: '', // Başlangıçta boş bir başlık
            createdAt: new Date()
        });
        navigation.navigate("Chat", { chatId: docRef.id });
    };

    const toggleChatSelection = (id) => {
        setSelectedChats((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(chatId => chatId !== id)
                : [...prevSelected, id]
        );
    };

    const deleteSelectedChats = async () => {
        if (selectedChats.length > 0) {
            Alert.alert(
                "Sohbetleri Sil",
                "Seçili sohbetleri silmek istediğinize emin misiniz?",
                [
                    {
                        text: "İptal",
                        style: "cancel"
                    },
                    {
                        text: "Sil",
                        onPress: async () => {
                            await Promise.all(selectedChats.map(async (id) => {
                                await deleteDoc(doc(database, 'chats', id));
                            }));
                            setSelectedChats([]);
                            setDeleteMode(false);
                        },
                        style: "destructive"
                    }
                ]
            );
        }
    };

    useEffect(() => {
        if (!deleteMode) {
            setSelectedChats([]);
        }
    }, [deleteMode]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.chatItem, 
                deleteMode && styles.chatItemDeleteMode, 
                selectedChats.includes(item.id) && styles.chatItemSelected
            ]}
            onPress={() => deleteMode ? toggleChatSelection(item.id) : navigation.navigate("Chat", { chatId: item.id })}
        >
            <Text style={styles.chatTitle}>{item.title ? item.title : 'Yeni Sohbet'}</Text>
        </TouchableOpacity>
    );

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.chatList}
                contentContainerStyle={styles.chatListContent}
            />
            {deleteMode && (
                <TouchableOpacity
                    onPress={deleteSelectedChats}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                onPress={createNewChat}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={24} color='#FAFAFA' />
            </TouchableOpacity>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    searchInput: {
        marginLeft: 10,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: 200,
    },
    chatList: {
        flex: 1,
    },
    chatListContent: {
        paddingBottom: 20,
    },
    chatItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#FFF',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    chatItemDeleteMode: {
        backgroundColor: '#f9f9f9',
    },
    chatItemSelected: {
        backgroundColor: '#e0e0e0',
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chatButton: {
        backgroundColor: '#6200ea',
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6200ea',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
        position: 'absolute',
        right: 20,
        bottom: 50,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        backgroundColor: '#ff5c5c',
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ff0000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});