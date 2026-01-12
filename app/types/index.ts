export interface Todo {
  $id: string;
  userId: string;
  title: string;
  completed: boolean;
  parentId: string | null;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface User {
  $id: string;
  email: string;
  name?: string;
}
