import TodoList from "@/components/todo/TodoList";

const Todos = () => {
  return (
    <div className="h-full bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Moji zadaci</h1>
          <p className="text-gray-600 mt-1">Upravljajte vašim zadacima i obavezama</p>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Todos;
