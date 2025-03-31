export interface Todo {
  id: string;
  title: string;
  content: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
}

export type Habit = {
  id: string;
  title: string;
  notes?: string | null;
  categories?: string | null;
  createdAt: string;
  lastCompleted?: string | null;
  repeats: string;
  userId: string;
  user?: {
    nickname: string;
    id: string;
  };
};
