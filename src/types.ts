export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    unit: string;
    updatedAt?: any; // Timestamp from Firestore
}
