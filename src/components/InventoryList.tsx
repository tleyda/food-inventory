import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Chip } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { InventoryItem, ItemTags } from "../types";
import React from "react";

interface InventoryListProps {
    items: InventoryItem[];
    availableTags: ItemTags[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}

const columns = [
    { name: "NAME", uid: "name" },
    { name: "QTY", uid: "quantity" },
    { name: "CATEGORY", uid: "category" },
    { name: "TAGS", uid: "tags" },
    { name: "ACTIONS", uid: "actions" },
];

const categoryColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
    Produce: "success",
    Dairy: "primary",
    Meat: "danger",
    Pantry: "warning",
    Frozen: "secondary",
    Beverages: "default",
    Snacks: "warning",
    Household: "default",
};
export function InventoryList({ items, availableTags, onEdit, onDelete }: InventoryListProps) {
    console.log("availableTags", availableTags);

    const renderCell = React.useCallback((item: InventoryItem, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{item.name}</p>
                    </div>
                );
            case "quantity":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-default-400">{item.quantity} {item.unit}</p>
                    </div>
                );
            case "category":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" color={categoryColorMap[item.category] || "default"}>
                        {item.category}
                    </Chip>
                );
            case "tags":
                return (
                    <div className="flex flex-wrap gap-1">
                        {item.tags?.map(tagId => {
                            const tag = availableTags.find(t => t.id === tagId);
                            console.log("Tag", { tagId, tag });
                            if (!tag) return null;
                            return (
                                <Chip 
                                    key={tagId} 
                                    size="sm" 
                                    variant="flat" 
                                    style={{ 
                                        background: `${tag.color}10`,
                                        color: tag.color,
                                        borderColor: tag.color,
                                    }}
                                    className="border"
                                >
                                    {tag.label}
                                </Chip>
                            );
                        })}
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Edit item">
                            <span 
                                data-testid={`edit-button-${item.id}`}
                                className="text-lg text-default-400 cursor-pointer active:opacity-50" 
                                onClick={() => onEdit(item)}
                            >
                                <Edit size={18} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete item">
                            <span 
                                data-testid={`delete-button-${item.id}`}
                                className="text-lg text-danger cursor-pointer active:opacity-50" 
                                onClick={() => onDelete(item.id)}
                            >
                                <Trash2 size={18} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    }, [onEdit, onDelete, availableTags]);

    return (
        <Table aria-label="Inventory table">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={items} emptyContent={"No items found."}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
