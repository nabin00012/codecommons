export interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
