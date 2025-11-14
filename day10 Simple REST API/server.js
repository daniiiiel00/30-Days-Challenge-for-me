const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/items", itemRoutes);

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to the Simple Notes API. Use /items to access the endpoints.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
