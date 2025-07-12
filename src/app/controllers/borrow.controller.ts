import express, { Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/books.model';

export const borrowRoutes = express.Router();


borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;

    // 1. Get the book
    const foundBook = await Book.findById(book);
    if (!foundBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // 2. Check quantity
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Copies must be a positive number",
      });
    }

    // 3. Check if enough copies are available
    if (foundBook.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${foundBook.copies} copies available`,
      });
    }

    // 4. Deduct copies and update availability
    foundBook.copies -= quantity;
    if (foundBook.copies === 0) {
      foundBook.available = false;
    }
    await foundBook.save();

    // 5. Create borrow record only after successful book update
    const newBorrow = await Borrow.create({
      book,
      quantity,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: newBorrow,
    });

  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(400).json({
      success: false,
      message: "Failed to borrow book",
      error: error instanceof Error ? error.message : error,
    });
  }
});

borrowRoutes.get("/borrow", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "books", // collection name (case-sensitive)
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      {
        $unwind: "$bookDetails"
      },
      {
        $project: {
          _id: 0, // ❗ remove _id from final output
          totalQuantity: 1,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn"
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary
    });

  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve summary",
      error: error instanceof Error ? error.message : error
    });
  }
});
