import { HeroUIProvider, Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useInventory } from "./hooks/useInventory";
import { InventoryList } from "./components/InventoryList";
import { ItemModal } from "./components/ItemModal";
import type { InventoryItem } from "./types";
import { useState } from "react";

function Home() {
  const { items, loading, addItem, updateItem, deleteItem } = useInventory();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  console.log("Home page");

  const handleAdd = () => {
    console.log("Adding item");
    setEditingItem(undefined);
    onOpen();
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    onOpen();
  };

  const handleSave = async (itemData: Omit<InventoryItem, "id" | "updatedAt">) => {
    if (editingItem) {
      await updateItem(editingItem.id, itemData);
    } else {
      await addItem(itemData);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center bg-content1 p-4 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Food Inventory
        </h1>
        <Button color="primary" variant="solid" endContent={<Plus />} onPress={handleAdd} className="font-semibold shadow-lg shadow-blue-500/40">
          Add Item
        </Button>
      </div>

      <div className="bg-content1 rounded-xl shadow-sm p-2">
        {/* Simple loading state */}
        {loading ? (
          <div className="flex justify-center p-8">
            <p className="text-default-400">Loading inventory...</p>
          </div>
        ) : (
          <InventoryList
            items={items}
            onEdit={handleEdit}
            onDelete={deleteItem}
          />
        )}
      </div>

      <ItemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate}>
      {/* <main className="dark text-foreground bg-background min-h-screen p-4 sm:p-6 bg-cover bg-fixed"> */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </HeroUIProvider>
  );
}

export default App;
