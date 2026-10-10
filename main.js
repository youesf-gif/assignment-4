import express from "express";
import mysql from "mysql2/promise";
import { productRouter } from "./app/products.js";
import { suppliersRouter } from "./app/suppliers.js";
import { salesRouter } from "./app/sales.js";

const app = express();
const PORT = 3000;

app.use(express.json());
// Q-1
export const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    database: "c49",
    user: "root",
    password: "Youssef@123",
});

try {
    await pool.getConnection();
    console.log("DB connected");
} catch (err) {
    console.log("DB connection fail");
    console.log(err.message);
}
// Create tables
app.get("/", async (req, res) => {
    const queries = [
        `
        create table suppliers (
        id int primary key auto_increment,
        suppliersName text NOT NULL,
        contactNumber text
    );`,
        `
    create table products (
        id int primary key auto_increment,
        productName text NOT NULL,
        price DECIMAL(10, 2),
        stockQuantity int DEFAULT 0,
        supplierID int,
        foreign key (supplierID) references suppliers (id) on delete CASCADE
    );`,
        `
    create table sales (
        id int primary key auto_increment,
        productID int,
        quantitySold int NOT NULL,
        saleDate date NOT NULL,
        foreign key (productID) references products (id) on delete CASCADE
    );`,
    ];
    try {
        for (const query of queries) {
            await pool.execute(query);
        }

        res.status(200).json({ message: "Tables created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Tables not created",
            error: err.message,
        });
    }
});

// Q-2
app.use("/products", productRouter);
// Q-3
app.use("/suppliers", suppliersRouter);
// Q-4
app.use("/sales", salesRouter);

// Q-5
app.get("/add-category", async (req, res) => {
    try {
        await pool.query(
            `ALTER Table products ADD COLUMN category VARCHAR(50)`,
        );

        res.json({ message: "Category added succussfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to add category",
            error: err.message,
        });
    }
});

app.get("/remove-category", async (req, res) => {
    try {
        await pool.query(`ALTER Table products DROP COLUMN category`);

        res.json({ message: "Category removed succussfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to remove category",
            error: err.message,
        });
    }
});

app.get("/change-contactNumber", async (req, res) => {
    try {
        await pool.query(
            `ALTER Table suppliers MODIFY contactNumber VARCHAR(15);`,
        );

        res.json({ message: "Contact number changed succussfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to change contact number",
            error: err.message,
        });
    }
});

app.get("/add-notNull", async (req, res) => {
    try {
        await pool.query(
            `ALTER Table products MODIFY productName TEXT NOT NULL;`,
        );

        res.json({ message: "productName column is now NOT NULL" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to modify productName column",
            error: error.message,
        });
    }
});

// Q-6

app.get("/initialization", async (req, res) => {
    try {
        await pool.query(`
            INSERT INTO
                suppliers (supplierName, contactNumber)
            VALUES ('FreshFoods', '01001234567');
            `);

        const [freshFoodID] = await pool.query(
            `SELECT id FROM suppliers WHERE supplierName = 'FreshFoods';`,
        );

        await pool.query(
            `
                INSERT INTO
                products (
                    productName,
                    price,
                    stockQuantity,
                    supplierID
                )
            VALUES ('Milk', 15.00, 50, ?),
                ("Bread", 20.00, 30, ?),
                ('Eggs', 20.00, 40, ?)
                `,
            [freshFoodID[0].id, freshFoodID[0].id, freshFoodID[0].id],
        );

        const [milkID] = await pool.query(
            `select id from products WHERE productName = "Milk"`,
        );

        await pool.query(
            `
            INSERT INTO
            sales (
                quantitySold,
                saleDate,
                productID
            )
        VALUES (2, '2025-05-20', ?)
            `,
            [milkID[0].id],
        );

        res.json({ message: "Initialization created successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to create initialization",
            error: err.message,
        });
    }
});

// Q-7
app.get("/update-bread-price", async (req, res) => {
    const { price } = req.body;

    try {
        await pool.query(
            `UPDATE products SET price = ? WHERE productName = "Bread"`,
            [price],
        );

        res.json({ message: "Bread price updated successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update bread price",
            error: err.message,
        });
    }
});

// Q-8
app.get("/delete-eggs", async (req, res) => {
    try {
        await pool.query(`DELETE from products WHERE productName = "Eggs"`);

        res.json({ message: "Eggs deleted successfully" });
    } catch (err) {
        res.status(400).json({
            message: "Failed to delete Eggs",
            error: err.message,
        });
    }
});

// Q-9
app.get("/total-quantity", async (req, res) => {
    try {
        const [data] =
            await pool.query(`SELECT p.*, SUM(quantitySold) as totalQuantitySold
            from sales s
            JOIN products p on s.productID = p.id
            GROUP BY
            productID
    `);
        res.json({
            message: "Total quantity sold retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve total quantity sold",
            error: err.message,
        });
    }
});

// Q-10
app.get("/highest-stock-quantity", async (req, res) => {
    try {
        const [data] = await pool.query(
            `SELECT * FROM products ORDER BY stockQuantity DESC LIMIT 1`,
        );
        res.json({
            message: "Highest stock quantity retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve highest stock quantity",
            error: err.message,
        });
    }
});

// Q-11
app.get("/suppliers-start-with-f", async (req, res) => {
    try {
        const [data] = await pool.query(
            `SELECT * FROM suppliers WHERE supplierName LIKE 'F%'`,
        );

        res.json({
            message: "Suppliers start with 'F' retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve suppliers start with 'F'",
            error: err.message,
        });
    }
});

// Q-12
app.get("/products-have-never-sold", async (req, res) => {
    try {
        const [data] = await pool.query(`
        SELECT p.*
        FROM products p
            LEFT JOIN sales s on p.id = s.productID
        WHERE
            s.quantitySold IS NULL;
    `);

        res.json({
            message: "Products have never sold retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve products have never sold",
            error: err.message,
        });
    }
});

// Q-13
app.get("/all-sales", async (req, res) => {
    try {
        const [data] = await pool.query(`
        SELECT p.productName, s.quantitySold, s.saleDate
        FROM sales s
            JOIN products p on s.productID = p.id
    `);

        res.json({
            message: "All sale retrieved successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to retrieve all sale",
            error: err.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port :: ${PORT}`);
});
