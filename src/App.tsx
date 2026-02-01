import { HeroUIProvider, Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useInventory } from "./hooks/useInventory";
import { useTags } from "./hooks/useTags";
import { InventoryList } from "./components/InventoryList";
import { ItemModal } from "./components/ItemModal";
import { Login } from "./components/Login";
import type { InventoryItem } from "./types";
import { useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";

function Home() {
  const { items, loading, addItem, updateItem, deleteItem } = useInventory();
  const { tags: availableTags, loading: tagsLoading } = useTags();
  const { currentUser, logout } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

  const handleAdd = () => {
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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full p-4">
      <div className="flex justify-between items-center bg-content1 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Food Inventory
          </h1>
          {currentUser && <p className="text-xs text-default-400">Signed in as {currentUser.email}</p>}
        </div>
        <div className="flex gap-2">
          <Button color="secondary" variant="flat" onPress={logout} size="sm">
            Logout
          </Button>
          <Button color="primary" variant="solid" endContent={<Plus />} onPress={handleAdd} className="font-semibold shadow-lg shadow-blue-500/40">
            Add Item
          </Button>
        </div>
      </div>

      <div className="bg-content1 rounded-xl shadow-sm p-2">
        {loading || tagsLoading ? (
          <div className="flex justify-center p-8">
            <p className="text-default-400">Loading inventory...</p>
          </div>
        ) : (
          <InventoryList
            items={items}
            availableTags={availableTags}
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

function Main() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-default-400 text-lg">Initializing app...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <HeroUIProvider navigate={navigate}>
        <main>
          <Main />
        </main>
      </HeroUIProvider>
    </AuthProvider>
  );
}

export default App;
