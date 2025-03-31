'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import HabitItem from './HabitItem';
import { Habit } from '@/types/todo';

export default function HabitList() {
  const { data: session } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/habits');
        if (!response.ok) {
          throw new Error('습관 목록을 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setHabits(data);
      } catch (err) {
        setError('습관 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('습관 삭제에 실패했습니다.');
      }

      setHabits(habits.filter((habit) => habit.id !== id));
    } catch (err) {
      console.error('Habit 삭제 중 오류:', err);
    }
  };

  const handleUpdate = async (id: string, lastCompleted?: string) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastCompleted }),
      });

      if (!response.ok) {
        throw new Error('습관 업데이트에 실패했습니다.');
      }

      const updatedHabit = await response.json();
      setHabits(
        habits.map((habit) => (habit.id === id ? updatedHabit : habit)),
      );
    } catch (err) {
      console.error('Habit 업데이트 중 오류:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (habits.length === 0) {
    return <div className="text-center py-4">등록된 습관이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
