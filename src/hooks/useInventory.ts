import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import type { InventoryItem } from '../types';

export function useInventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'inventory'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const inventoryData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InventoryItem[];
            setItems(inventoryData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addItem = async (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => {
        await addDoc(collection(db, 'inventory'), {
            ...item,
            updatedAt: serverTimestamp()
        });
    };

    const updateItem = async (id: string, item: Partial<InventoryItem>) => {
        const docRef = doc(db, 'inventory', id);
        const updateData = { ...item, updatedAt: serverTimestamp() };
        await updateDoc(docRef, updateData);
    };

    const deleteItem = async (id: string) => {
        await deleteDoc(doc(db, 'inventory', id));
    };

    return { items, loading, addItem, updateItem, deleteItem };
}
