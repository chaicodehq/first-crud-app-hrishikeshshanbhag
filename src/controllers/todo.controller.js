import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const data = req.body;
    const todo = await Todo.create(data);
    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    let queryObj = {};
    let page = 1;
    let limit = 10;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    if (req.query.completed !== undefined) {
      queryObj.completed = req.query.completed === "true";
    }

    if (req.query.priority) {
      queryObj.priority = req.query.priority;
    }

    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: "i" };
    }
    let skip = (page - 1) * limit;
    const data = await Todo.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = (await Todo.countDocuments(queryObj)) || 0;
    const pages = Math.ceil(total / limit) || 0;
    return res.status(200).json({
      data: data ? data : [],
      meta: {
        total: total,
        page: page,
        limit: limit,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    if (!todo)
      return res.status(404).json({
        error: {
          message: "not found",
        },
      });
    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedTodo)
      return res.status(404).json({
        error: {
          message: "not found",
        },
      });
    return res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const id = req.params.id;

    const todo = await Todo.findById(id);

    if (!todo)
      return res.status(404).json({
        error: {
          message: "not found",
        },
      });
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: {
          completed: !todo.completed,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const id = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo)
      return res.status(404).json({
        error: {
          message: "not found",
        },
      });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
