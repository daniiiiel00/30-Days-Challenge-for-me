const { v4: uuidv4 } = require("uuid");

let items = [
  {
    id: "1a2b3c4d-5e6f-7890-abcd-ef0123456789",
    title: "First Note",
    content: "This is the first note in the list.",
    createdAt: new Date(),
    updatedAt: new Date(), // <-- FIX IS HERE
  },
  {
    id: "98765432-10fe-dcba-9876-543210fedcba",
    title: "Express Setup",
    content: "Remember to install express, cors, and uuid.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const getAllItems = (req, res) => {
  res.json(items);
};

const getItemById = (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
};

const createItem = (req, res) => {
  const { title, content } = req.body;

  if (!title || title.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Title is required and cannot be empty" });
  }

  const newItem = {
    id: uuidv4(),
    title,
    content: content || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  items.push(newItem);
  res.status(201).json(newItem);
};

const updateItem = (req, res) => {
  const { title, content } = req.body;
  const itemIndex = items.findIndex((i) => i.id === req.params.id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (!title || title.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Title is required and cannot be empty" });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    title,
    content: content || items[itemIndex].content,
    updatedAt: new Date(),
  };

  res.json(items[itemIndex]);
};

const deleteItem = (req, res) => {
  const initialLength = items.length;
  items = items.filter((i) => i.id !== req.params.id);

  if (items.length === initialLength) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.status(204).send();
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
