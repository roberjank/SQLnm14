/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mysql = require("mysql2/promise");

const PORT = process.env.SERVER_PORT || 5000;

const app = express();

// middleware

app.use(morgan("common"));
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "type_5_posts",
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/createShirt1", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Prisij ===");

    const sql = `
    INSERT INTO shirts (brand , model , size, price) VALUES 
    (?, ?, ?, ?)
    `;
    const { brand, model, size, price } = req.body;

    const [rows, fields] = await connection.execute(sql, [
      brand,
      model,
      size,
      price,
    ]);

    await connection.close();
    res.json({
      rows,
      fields,
    });
    // res.json("ok");
  } catch (error) {
    console.log("fuck", error);
    res.status(500).send("klaida");
  }
});

app.get("/shirts", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.query(
      "SELECT price FROM shirts ORDER BY price LIMIT 10"
    );
    await conn.close();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
