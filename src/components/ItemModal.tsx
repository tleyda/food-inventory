import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import type { InventoryItem } from "../types";

interface ItemModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (item: Omit<InventoryItem, "id" | "updatedAt">) => Promise<void>;
    item?: InventoryItem;
}

const CATEGORIES = [
    { key: "Produce", label: "Produce" },
    { key: "Dairy", label: "Dairy" },
    { key: "Meat", label: "Meat" },
    { key: "Pantry", label: "Pantry" },
    { key: "Frozen", label: "Frozen" },
    { key: "Beverages", label: "Beverages" },
    { key: "Snacks", label: "Snacks" },
    { key: "Household", label: "Household" }
];

const UNITS = [
    { key: "pcs", label: "Pieces" },
    { key: "kg", label: "Kilograms" },
    { key: "g", label: "Grams" },
    { key: "L", label: "Liters" },
    { key: "ml", label: "Milliliters" },
    { key: "oz", label: "Ounces" },
    { key: "lb", label: "Pounds" },
    { key: "gal", label: "Gallons" },
    { key: "box", label: "Box" },
    { key: "can", label: "Can" }
];

export function ItemModal({ isOpen, onOpenChange, onSave, item }: ItemModalProps) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [category, setCategory] = useState<string>("Pantry");
    const [unit, setUnit] = useState<string>("pcs");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setName(item.name);
                setQuantity(item.quantity.toString());
                setCategory(item.category);
                setUnit(item.unit);
            } else {
                setName("");
                setQuantity("1");
                setCategory("Pantry");
                setUnit("pcs");
            }
        }
    }, [item, isOpen]);

    const handleSubmit = async () => {
        if (!name) return;
        try {
            setLoading(true);
            await onSave({
                name,
                quantity: parseFloat(quantity) || 0,
                category,
                unit
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save item", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("ItemModal", { isOpen });

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{item ? "Edit Item" : "Add Item"}</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Name"
                                placeholder="e.g. Milk"
                                variant="bordered"
                                value={name}
                                onValueChange={setName}
                            />
                            <div className="flex gap-2">
                                <Input
                                    label="Quantity"
                                    type="number"
                                    placeholder="1"
                                    variant="bordered"
                                    value={quantity}
                                    onValueChange={setQuantity}
                                    className="flex-1"
                                />
                                <Select
                                    label="Unit"
                                    variant="bordered"
                                    selectedKeys={[unit]}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-32"
                                >
                                    {UNITS.map((u) => (
                                        <SelectItem key={u.key}>{u.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <Select
                                label="Category"
                                variant="bordered"
                                selectedKeys={[category]}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c.key}>{c.label}</SelectItem>
                                ))}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
