import { Document, Model } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface BookModel extends Model<IBook> {
  updateStockAfterBorrow(bookId: string, quantity: number): Promise<void>;
}
