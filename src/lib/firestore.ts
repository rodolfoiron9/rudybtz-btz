import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import type { Album } from './types';

const albumsCollection = collection(db, 'albums');

export const getAlbums = async (): Promise<Album[]> => {
    const snapshot = await getDocs(albumsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
};

export const addAlbum = async (album: Omit<Album, 'id'>): Promise<DocumentReference> => {
    return await addDoc(albumsCollection, album);
};

export const updateAlbum = async (id: string, album: Partial<Album>): Promise<void> => {
    const albumDoc = doc(db, 'albums', id);
    return await updateDoc(albumDoc, album);
};

export const deleteAlbum = async (id: string): Promise<void> => {
    const albumDoc = doc(db, 'albums', id);
    return await deleteDoc(albumDoc);
};
