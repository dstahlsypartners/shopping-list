'use client';

import { Item } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ItemListProps = {
  items: Record<string, Item[]>;
  listId: string;
};

export function ItemList({ items, listId }: ItemListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function deleteItem(itemId: string) {
    if (isDeleting) return;
    
    setIsDeleting(itemId);
    try {
      const res = await fetch(`/api/lists/${listId}/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setIsDeleting(null);
    }
  }

  if (Object.keys(items).length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No items in this list yet. Add some items to get started!
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(items).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-lg font-medium mb-4">{category}</h3>
          <ul className="space-y-2">
            {categoryItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="ml-2 text-gray-600">× {item.quantity}</span>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  disabled={isDeleting === item.id}
                  className="text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {isDeleting === item.id ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 