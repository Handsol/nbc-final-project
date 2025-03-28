"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { useSession } from "next-auth/react";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Todo 목록 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error("Todo 목록을 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError("Todo 목록을 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Todo 항목 삭제
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Todo 삭제에 실패했습니다.");
      }

      // 성공적으로 삭제되면, UI에서도 해당 Todo 제거
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Todo 삭제 중 오류:", err);
    }
  };

  // Todo 항목 상태 업데이트 (완료/미완료)
  const handleUpdate = async (id: string, isDone: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isDone })
      });

      if (!response.ok) {
        throw new Error("Todo 업데이트에 실패했습니다.");
      }

      const updatedTodo = await response.json();

      // 성공적으로 업데이트되면, UI에서도 해당 Todo 업데이트
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      console.error("Todo 업데이트 중 오류:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="text-center py-4">등록된 할 일이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
