"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const books_model_1 = require("../models/books.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        // 1. Get the book
        const foundBook = yield books_model_1.Book.findById(book);
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
        yield foundBook.save();
        // 5. Create borrow record only after successful book update
        const newBorrow = yield borrow_model_1.Borrow.create({
            book,
            quantity,
            dueDate,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: newBorrow,
        });
    }
    catch (error) {
        console.error("Error borrowing book:", error);
        res.status(400).json({
            success: false,
            message: "Failed to borrow book",
            error: error instanceof Error ? error.message : error,
        });
    }
}));
exports.borrowRoutes.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
    }
    catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve summary",
            error: error instanceof Error ? error.message : error
        });
    }
}));
