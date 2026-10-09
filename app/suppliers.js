import { Router } from "express";
import { pool } from "../main.js";

const suppliersRouter = Router();

suppliersRouter.post("/", async (req, res) => {
    try {
        const { supplierName, contactNumber } = req.body;
        await pool.query(
            `INSERT INTO
                        suppliers (
                            supplierName,
                            contactNumber
                        )
                    VALUES (?, ?);`,
            [supplierName, contactNumber],
        );
        res.json({ message: "Supplier created successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to create supplier",
            error: err.message,
        });
    }
});

suppliersRouter.get("/", async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * FROM suppliers`);
        res.json({
            message: "Suppliers retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve suppliers",
            error: err.message,
        });
    }
});

suppliersRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierName, contactNumber } = req.query;
        await pool.query(
            `UPDATE suppliers
                set
                    supplierName = ?
                    AND contactNumber = ?
                WHERE
                    id = ?`,
            [supplierName, contactNumber, id],
        );

        res.json({ message: "Supplier updated successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update supplier",
            error: err.message,
        });
    }
});

suppliersRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM suppliers WHERE id=?", [id]);

        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to delete supplier",
            error: err.message,
        });
    }
});

export { suppliersRouter };
