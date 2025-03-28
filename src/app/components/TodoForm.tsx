"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface TodoFormProps {
  onAdd: () => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error("Todo 생성에 실패했습니다.");
      }

      // 성공적으로 생성되면 폼 리셋
      setTitle("");
      setContent("");
      setError(null);

      // 부모 컴포넌트에 알림 (목록 갱신)
      onAdd();
    } catch (err) {
      console.error("Todo 생성 중 오류:", err);
      setError("Todo 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        투두 항목을 추가하려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm mb-6 border"
    >
      <h2 className="text-xl font-bold mb-4">새 할 일 추가</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="할 일 제목"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="할 일 내용"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isSubmitting ? "추가 중..." : "할 일 추가"}
      </button>
    </form>
  );
}
