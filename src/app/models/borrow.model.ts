import mongoose, { Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.model";
const borrowSchema = new Schema<IBorrow>({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1 },
  dueDate: { type: Date, required: true }
}, {
  timestamps: true,
  versionKey: false
});

borrowSchema.post('save', async function (doc) {
  try {
    const book = await Book.findById(doc.book);

    if (!book) {
      console.error('Book not found!');
      return;
    }

    book.copies = book.copies - doc.quantity;

    if (book.copies <= 0) {
      book.available = false;
    }

    //  this line use for validation errors:
    await book.save({ validateBeforeSave: false });

    console.log(" Book updated after borrow");
  } catch (err) {
    console.error("Error in borrow post middleware:", err);
  }
}

);



export const Borrow = mongoose.model<IBorrow>('Borrow', borrowSchema);