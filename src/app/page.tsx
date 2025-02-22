import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

async function getLists() {
  const lists = await prisma.list.findMany({
    include: {
      _count: {
        select: { items: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return lists;
}

export default async function Home() {
  const { userId } = auth();
  const lists = userId ? await getLists() : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Shopping List</h1>
          <p className="mb-8">Sign in to manage your shopping lists</p>
          <Link 
            href="/sign-in"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Shopping Lists</h1>
            <Link
              href="/lists/new"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              New List
            </Link>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">
                No lists yet. Create your first list!
              </p>
            ) : (
              lists.map((list) => (
                <div key={list.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{list.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {list._count.items} item{list._count.items === 1 ? "" : "s"}
                  </p>
                  <div className="flex justify-end">
                    <Link
                      href={`/lists/${list.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View List →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
