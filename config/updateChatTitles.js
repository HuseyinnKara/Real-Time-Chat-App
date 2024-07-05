import { getFirestore, collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: //Your Firebase apiKey,
    authDomain: //Your Firebase authDomain,
    projectId: //Your Firebase projectId,
    storageBucket: //Your Firebase storageBucked,
    messagingSenderId: //Your Firebase messagingSenderId,
    appId: //Your Firebase appId
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

const updateChatTitles = async () => {
    try {
        const chatsCollectionRef = collection(database, 'chats');
        const chatDocs = await getDocs(chatsCollectionRef);

        chatDocs.forEach(async (chatDoc) => {
            if (chatDoc.data().title) return;

            const messagesCollectionRef = collection(database, 'chats', chatDoc.id, 'messages');
            const firstMessageQuery = query(messagesCollectionRef, orderBy('createdAt'), limit(1));
            const firstMessageDocs = await getDocs(firstMessageQuery);

            if (!firstMessageDocs.empty) {
                const firstMessageDoc = firstMessageDocs.docs[0];
                const firstMessageText = firstMessageDoc.data().text;

                await updateDoc(doc(database, 'chats', chatDoc.id), {
                    title: firstMessageText
                });

                console.log(`Sohbet ${chatDoc.id} güncellendi: ${firstMessageText}`);
            }
        });

        console.log('Tüm sohbetlerin başlıkları güncellendi.');
    } catch (error) {
        console.error('Hata:', error);
    }
};

updateChatTitles();