import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let todos = [
  {
    id: 1,
    title: "Exempel",
    description: "Detta är en exempel-todo",
    status: "Ej påbörjad",
  },
];

function isValidStatus(s) {
  return s === "Ej påbörjad" || s === "Pågående" || s === "Avklarad";
}

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Todo API running" });
});

// READ all
app.get("/todos", (req, res) => {
  res.json(todos);
});

// READ one
app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: "Not found" });
  res.json(todo);
});

// CREATE
app.post("/todos", (req, res) => {
  const { title, description = "", status = "Ej påbörjad" } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({ message: "Title must be at least 3 characters" });
  }
  if (typeof description !== "string" || description.length > 200) {
    return res.status(400).json({ message: "Description max 200 characters" });
  }
  if (!isValidStatus(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

  const newTodo = {
    id: nextId,
    title: title.trim(),
    description,
    status,
  };

  todos = [newTodo, ...todos];
  res.status(201).json(newTodo);
});

// UPDATE (PATCH)
app.patch("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const patch = req.body ?? {};
  const current = todos[idx];

  const next = { ...current };

  if ("title" in patch) {
    if (typeof patch.title !== "string" || patch.title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }
    next.title = patch.title.trim();
  }

  if ("description" in patch) {
    if (typeof patch.description !== "string" || patch.description.length > 200) {
      return res.status(400).json({ message: "Description max 200 characters" });
    }
    next.description = patch.description;
  }

  if ("status" in patch) {
    if (!isValidStatus(patch.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    next.status = patch.status;
  }

  todos[idx] = next;
  res.json(next);
});

// DELETE
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = todos.some((t) => t.id === id);
  if (!exists) return res.status(404).json({ message: "Not found" });

  todos = todos.filter((t) => t.id !== id);
  res.status(204).send();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Todo API listening on ${PORT}`));
