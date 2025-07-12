import { Schema, model } from "mongoose";
import { IBook, BookModel } from "../interfaces/book.interface";

const booksSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
  },
  isbn: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: "no description here" },
  copies: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false
});

// Static method update stock
booksSchema.statics.updateStockAfterBorrow = async function (bookId: string, quantity: number) {
  const book = await this.findById(bookId);
  if (!book) throw new Error("Book not found");
  if (quantity <= 0) throw new Error("Invalid borrow quantity");
  if (book.copies < quantity) throw new Error(`Only ${book.copies} copies available`);

  book.copies -= quantity;
  if (book.copies === 0) {
    book.available = false;
  }
  await book.save();
};

export const Book = model<IBook, BookModel>("Book", booksSchema);
