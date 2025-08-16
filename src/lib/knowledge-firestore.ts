import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import type { KnowledgeArticle } from './types';

const articlesCollection = collection(db, 'knowledgeArticles');

export const getArticles = async (): Promise<KnowledgeArticle[]> => {
    const snapshot = await getDocs(articlesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeArticle));
};

export const addArticle = async (article: Omit<KnowledgeArticle, 'id'>): Promise<DocumentReference> => {
    return await addDoc(articlesCollection, article);
};

export const updateArticle = async (id: string, article: Partial<KnowledgeArticle>): Promise<void> => {
    const articleDoc = doc(db, 'knowledgeArticles', id);
    return await updateDoc(articleDoc, article);
};

export const deleteArticle = async (id: string): Promise<void> => {
    const articleDoc = doc(db, 'knowledgeArticles', id);
    return await deleteDoc(articleDoc);
};
