import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { ItemTags } from '../types';

export function useTags() {
    const [tags, setTags] = useState<ItemTags[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'tags'), orderBy('label'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tagsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ItemTags[];
            setTags(tagsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tags:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { tags, loading };
}
