// lib/mappers.ts
import { BookAPI } from './api';

// UI-facing model (what your JSX expects)
export interface BookUI {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary :string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  
}


// Convert API → UI
export function mapBookToUI(book: BookAPI): BookUI {
  return {
    id: book.id,
    title: book.title,
    subTitle: book.subTitle,
    author: book.author,
    imageLink: book.imageLink,
    audioLink: book.audioLink,
    totalRating: book.totalRating,
    averageRating: book.averageRating,
    keyIdeas: book.keyIdeas,
    type: book.type,
    status: book.status,
    subscriptionRequired: book.subscriptionRequired,
    summary :book.summary,
    tags: book.tags,
    bookDescription: book.bookDescription,
    authorDescription: book.authorDescription,
  
    };
}
