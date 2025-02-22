import { NewListForm } from "./new-list-form";

export default function NewListPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Create New List</h1>
      <NewListForm />
    </main>
  );
} 