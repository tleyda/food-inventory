export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    unit: string;
    tags?: string[];
    updatedAt?: any; // Timestamp from Firestore
}

export interface ItemTags {
    id: string;
    label: string;
    color: string;
}
