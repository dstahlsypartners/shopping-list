export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type List = {
  id: string;
  title: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}; 