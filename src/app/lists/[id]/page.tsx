import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddItemForm } from "./add-item-form";
import { ItemList } from "./item-list";

async function getList(id: string) {
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { category: "asc" }
      }
    }
  });

  if (!list) notFound();
  return list;
}

export default async function ListPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return null; // Middleware will handle redirect

  const list = await getList(params.id);
  
  // Group items by category
  const itemsByCategory = list.items.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof list.items>);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link 
            href="/"
            className="text-blue-500 hover:text-blue-600 mb-2 inline-block"
          >
            ← Back to Lists
          </Link>
          <h1 className="text-2xl font-bold">{list.title}</h1>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <ItemList items={itemsByCategory} listId={list.id} />
        </div>

        <div className="md:border-l md:pl-8">
          <h2 className="text-xl font-semibold mb-4">Add Item</h2>
          <AddItemForm listId={list.id} />
        </div>
      </div>
    </main>
  );
} 