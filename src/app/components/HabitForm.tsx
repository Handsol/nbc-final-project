'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface HabitFormProps {
  onAdd: () => void;
}

export default function HabitForm({ onAdd }: HabitFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, notes, categories }),
      });

      if (!response.ok) {
        throw new Error('습관 생성에 실패했습니다.');
      }

      setTitle('');
      setNotes('');
      setCategories('');
      setError(null);
      onAdd();
    } catch (err) {
      console.error('Habit 생성 중 오류:', err);
      setError('습관 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        습관을 추가하려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm mb-6 border"
    >
      <h2 className="text-xl font-bold mb-4">새 습관 추가</h2>

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
          placeholder="습관 제목"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          메모
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="습관 메모"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="categories"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          카테고리
        </label>
        <input
          type="text"
          id="categories"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="운동, 공부같은 거 일단 아무거나 "
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSubmitting ? '추가 중...' : '습관 추가'}
      </button>
    </form>
  );
}
