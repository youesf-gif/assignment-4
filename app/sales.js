import { Router } from "express";
import { pool } from "../main.js";

const salesRouter = Router();

salesRouter.post("/", async (req, res) => {
    const { productID, quantitySold, saleDate } = req.body;

    try {
        await pool.query(
            `
            INSERT INTO
            sales (
                productID,
                quantitySold,
                saleDate
            )
        VALUES (?, ?, ?)
            `,
            [productID, quantitySold, saleDate],
        );

        res.json({ message: "Sale created successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to create sale",
            error: err.message,
        });
    }
});

salesRouter.get("/", async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * FROM sales`);

        res.json({ message: "Sales retrieved successfully", data });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve sales",
            error: err.message,
        });
    }
});

salesRouter.get("/:productID", async (req, res) => {
    const { productID } = req.params;

    try {
        const [data] = await pool.query(
            `SELECT * from sales WHERE productID = ?`,
            [productID],
        );

        res.json({ message: "Sale retrieved successfully", data });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve sale",
            error: err.message,
        });
    }
});

export { salesRouter };
