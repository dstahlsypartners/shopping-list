import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ListManager } from "./list-manager";

async function getLists() {
  const lists = await prisma.list.findMany({
    include: {
      _count: {
        select: { items: true }
      }
    },
    orderBy: [
      { updatedAt: "desc" }
    ]
  });

  return lists;
}

export default async function AdminPage() {
  const { userId } = auth();
  
  // You might want to add more sophisticated admin checks
  if (!userId) {
    redirect("/sign-in");
  }

  const lists = await getLists();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Lists</h2>
          <ListManager lists={lists} />
        </div>
      </div>
    </main>
  );
} 