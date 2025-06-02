export interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  questionId: string;
  votes: number;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
