export interface Todo {
  id: string;
  title: string;
  content: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
}
