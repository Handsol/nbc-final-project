"use client";

import { Todo } from "@/types/todo";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onUpdate: (id: string, isDone: boolean) => void;
}

export default function TodoItem({ todo, onDelete, onUpdate }: TodoItemProps) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  // 사용자가 로그인했고 Todo의 소유자인지 확인
  const isOwner = session?.user?.id === todo.userId;

  // Todo 항목 토글
  const handleToggle = async () => {
    if (!isOwner) return;
    onUpdate(todo.id, !todo.isDone);
  };

  // Todo 항목 삭제
  const handleDelete = async () => {
    if (!isOwner) return;
    onDelete(todo.id);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isOwner && (
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={handleToggle}
                className="mr-3 h-5 w-5"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <h3
              className={`text-lg font-semibold ${
                todo.isDone ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h3>
          </div>

          {isExpanded && (
            <div className="mt-2 pl-8">
              <p className="text-gray-700">{todo.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                작성일: {new Date(todo.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm ml-2"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
