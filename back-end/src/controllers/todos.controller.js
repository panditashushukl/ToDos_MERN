import mongoose from "mongoose";
import { Todo } from "./../models/todos.model.js";
import { ApiError, ApiResponse, asyncHandler } from "./../utils/index.utils.js";

const { isValid: isValidObjectId } = mongoose.Types.ObjectId;

const createTodo = asyncHandler(async (req, res) => {
  const { content, label, dueDate } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Todo content is required");
  }

  if (!label || label.trim() === "") {
    throw new ApiError(400, "Label is required");
  }

  const todo = await Todo.create({
    content: content.trim(),
    label: label.trim(),
    dueDate: dueDate ? new Date(dueDate) : undefined,
    owner: req.user._id,
  });

  const createdTodo = await Todo.findById(todo._id).populate(
    "owner",
    "fullName username avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdTodo, "Todo created successfully"));
});

const getUserTodos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = { owner: req.user._id };

  // Filter by status
  if (status === "completed") {
    query.isCompleted = true;
    query.isArchieved = false;
  } else if (status === "pending") {
    query.isCompleted = false;
    query.isArchieved = false;
  } else if (status === "archived") {
    query.isArchieved = true;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const todos = await Todo.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalTodos = await Todo.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        todos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTodos / limit),
          totalTodos,
          hasNextPage: page < Math.ceil(totalTodos / limit),
          hasPrevPage: page > 1,
        },
      },
      "Todos fetched successfully"
    )
  );
});

const getTodoById = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId || !isValidObjectId(todoId)) {
    throw new ApiError("Either no Id or invalid Id is passed.");
  }

  const todo = await Todo.findOne({
    _id: todoId,
    owner: req.user._id,
  })
    .populate("owner", "fullName username avatar")
    .lean();

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

const getTodoByLabel = asyncHandler(async (req, res) => {
  const { label } = req.params;

  if (!label || label.trim() === "") {
    throw new ApiError(400, "Label is required");
  }

  const todos = await Todo.find({
    label,
    owner: req.user._id,
  }).populate("owner", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos by label fetched successfully"));
});

const getUserLabels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const labels = await Todo.distinct("label", { owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, labels, "Unique labels fetched successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { content, label, isCompleted, isArchieved, dueDate } = req.body;

  if (!todoId || !isValidObjectId(todoId)) {
    throw new ApiError("Either no Id or invalid Id is passed.");
  }

  const updateFields = {};

  if (content !== undefined) {
    if (content.trim() === "") {
      throw new ApiError(400, "Todo content cannot be empty");
    }
    updateFields.content = content.trim();
  }

  if (label !== undefined) {
    if (label.trim() === "") {
      throw new ApiError(400, "Todo label cannot be empty");
    }
    updateFields.label = label.trim();
  }

  if (isCompleted !== undefined) {
    updateFields.isCompleted = isCompleted;
  }

  if (isArchieved !== undefined) {
    updateFields.isArchieved = isArchieved;
  }

  if (dueDate !== undefined) {
    updateFields.dueDate = dueDate ? new Date(dueDate) : null;
  }

  const todo = await Todo.findOneAndUpdate(
    {
      _id: todoId,
      owner: req.user._id,
    },
    { $set: updateFields },
    { new: true }
  ).populate("owner", "fullName username avatar");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

const updateLabel = asyncHandler(async (req, res) => {
  const { label : oldLabel } = req.params;
  const { newLabel } = req.body;

  if (!oldLabel || !oldLabel.trim()) {
    throw new ApiError("Old Label is required");
  }

  if (!newLabel || !newLabel.trim()) {
    throw new ApiError("New Label is required");
  }

  const result = await Todo.updateMany(
    { label: oldLabel },
    { $set: { label: newLabel } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Label updated Successfully."));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId || !isValidObjectId(todoId)) {
    throw new ApiError("Either no Id or invalid Id is passed.");
  }

  const todo = await Todo.findOneAndDelete({
    _id: todoId,
    owner: req.user._id,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo deleted successfully"));
});

const deleteLabel = asyncHandler(async (req, res) => {
  const { label } = req.params;

  if (!label || label.trim() === "") {
    throw new ApiError(400, "Label is required");
  }

  const result = await Todo.deleteMany({ label });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        `All todos with label ${label} deleted successfully.`
      )
    );
});

const toggleTodoCompletion = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId || !isValidObjectId(todoId)) {
    throw new ApiError("Either no Id or invalid Id is passed.");
  }

  const todo = await Todo.findOne({
    _id: todoId,
    owner: req.user._id,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  const updatedTodo = await Todo.findById(todo._id).populate(
    "owner",
    "fullName username avatar"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTodo,
        `Todo marked as ${updatedTodo.isCompleted ? "completed" : "pending"}`
      )
    );
});

const toggleTodoArchive = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId || !isValidObjectId(todoId)) {
    throw new ApiError("Either no Id or invalid Id is passed.");
  }

  const todo = await Todo.findOne({
    _id: todoId,
    owner: req.user._id,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isArchieved = !todo.isArchieved;
  await todo.save();

  const updatedTodo = await Todo.findById(todo._id).populate(
    "owner",
    "fullName username avatar"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTodo,
        `Todo ${updatedTodo.isArchieved ? "archived" : "unarchived"} successfully`
      )
    );
});

const getTodoStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    totalTodos,
    completedTodos,
    pendingTodos,
    archivedTodos,
    overdueTodos,
  ] = await Promise.all([
    Todo.countDocuments({ owner: userId }),
    Todo.countDocuments({
      owner: userId,
      isCompleted: true,
      isArchieved: false,
    }),
    Todo.countDocuments({
      owner: userId,
      isCompleted: false,
      isArchieved: false,
    }),
    Todo.countDocuments({ owner: userId, isArchieved: true }),
    Todo.countDocuments({
      owner: userId,
      dueDate: { $lt: new Date() },
      isCompleted: false,
      isArchieved: false,
    }),
  ]);

  const stats = {
    total: totalTodos,
    completed: completedTodos,
    pending: pendingTodos,
    archived: archivedTodos,
    overdue: overdueTodos,
    completionRate:
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Todo statistics fetched successfully"));
});

const bulkUpdateTodos = asyncHandler(async (req, res) => {
  const { todoIds, operation } = req.body;

  if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
    throw new ApiError(400, "Todo IDs array is required");
  }

  if (!operation) {
    throw new ApiError(400, "Operation is required");
  }

  let updateFields = {};
  let message = "";

  switch (operation) {
    case "markCompleted":
      updateFields = { isCompleted: true };
      message = "Todos marked as completed";
      break;
    case "markPending":
      updateFields = { isCompleted: false };
      message = "Todos marked as pending";
      break;
    case "archive":
      updateFields = { isArchieved: true };
      message = "Todos archived";
      break;
    case "unarchive":
      updateFields = { isArchieved: false };
      message = "Todos unarchived";
      break;
    case "delete":
      const deletedTodos = await Todo.deleteMany({
        _id: { $in: todoIds },
        owner: req.user._id,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { deletedCount: deletedTodos.deletedCount },
            `${deletedTodos.deletedCount} todos deleted successfully`
          )
        );
    default:
      throw new ApiError(400, "Invalid operation");
  }

  const result = await Todo.updateMany(
    {
      _id: { $in: todoIds },
      owner: req.user._id,
    },
    { $set: updateFields }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { modifiedCount: result.modifiedCount }, message)
    );
});

export {
  createTodo,
  getUserTodos,
  getTodoById,
  getTodoByLabel,
  getUserLabels,
  updateTodo,
  deleteTodo,
  deleteLabel,
  toggleTodoCompletion,
  toggleTodoArchive,
  getTodoStats,
  bulkUpdateTodos,
  updateLabel,
};
