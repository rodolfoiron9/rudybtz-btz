import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import type { RoadmapItem } from './types';

const roadmapCollection = collection(db, 'roadmap');

export const getRoadmapItems = async (): Promise<RoadmapItem[]> => {
    const snapshot = await getDocs(roadmapCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadmapItem));
};

export const addRoadmapItem = async (item: Omit<RoadmapItem, 'id'>): Promise<DocumentReference> => {
    return await addDoc(roadmapCollection, item);
};

export const updateRoadmapItem = async (id: string, item: Partial<RoadmapItem>): Promise<void> => {
    const itemDoc = doc(db, 'roadmap', id);
    return await updateDoc(itemDoc, item);
};

export const deleteRoadmapItem = async (id: string): Promise<void> => {
    const itemDoc = doc(db, 'roadmap', id);
    return await deleteDoc(itemDoc);
};
