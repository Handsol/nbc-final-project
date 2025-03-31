'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Habit } from '@/types/todo';

interface HabitItemProps {
  habit: Habit;
  onDelete: (id: string) => void;
  onUpdate: (id: string, lastCompleted?: string) => void;
}

export default function HabitItem({
  habit,
  onDelete,
  onUpdate,
}: HabitItemProps) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  const isOwner = session?.user?.id === habit.userId;

  const handleComplete = async () => {
    if (!isOwner) return;
    onUpdate(habit.id, new Date().toISOString());
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    onDelete(habit.id);
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                className="mr-3 h-5 w-5 border rounded flex items-center justify-center"
              >
                {habit.lastCompleted ? '✓' : ''}
              </button>
            )}
            <h3
              className={`text-lg font-semibold ${
                habit.lastCompleted ? 'text-gray-500' : ''
              }`}
            >
              {habit.title}
            </h3>
          </div>

          {isExpanded && (
            <div className="mt-2 pl-8">
              {habit.notes && <p className="text-gray-700">{habit.notes}</p>}
              {habit.categories && (
                <p className="text-gray-600">카테고리: {habit.categories}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                생성일: {new Date(habit.createdAt).toLocaleString()}
              </p>
              {habit.lastCompleted && (
                <p className="text-xs text-gray-500">
                  마지막 완료: {new Date(habit.lastCompleted).toLocaleString()}
                </p>
              )}
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
