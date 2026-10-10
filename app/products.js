import { Router } from "express";
import { pool } from "../main.js";
import { error } from "node:console";

const productRouter = Router();

productRouter.post("/", async (req, res) => {
    const { productName, price, stockQuantity, supplierName } = req.body;

    try {
        const [supplierID] = await pool.query(
            `SELECT id from suppliers WHERE supplierName =?;
`,
            [supplierName],
        );
        await pool.query(
            `insert into products (productName,price,stockQuantity,supplierID) values (?,?,?,?)`,
            [productName, price, stockQuantity, supplierID[0].id],
        );

        res.json({ message: "Product created successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to create product",
            error: err.message,
        });
    }
});

productRouter.get("/", async (req, res) => {
    try {
        const [data] = await pool.query(`select * from products`);
        res.json({ message: "Products retrieved successfully", data });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve products",
            error: err.message,
        });
    }
});

productRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [data] = await pool.query(`SELECT * FROM products WHERE id= ?`, [
            id,
        ]);

        res.json({ message: "Product retrieved successfully", data });
    } catch (err) {
        res.status(404).json({
            message: "Failed to retrieve product",
            error: err.message,
        });
    }
});

productRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, price, stockQuantity, supplierID } = req.body;

        await pool.query(
            "UPDATE products SET productName=? and price = ? and stockQunatity=? and supplierID=? WHERE productID = ?",
            [productName, price, stockQuantity, supplierID, id],
        );

        res.json({ message: "Product updated successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update product",
            error: err.message,
        });
    }
});

productRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM products WHERE id=?", [id]);

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to delete product",
            error: err.message,
        });
    }
});

export { productRouter };
