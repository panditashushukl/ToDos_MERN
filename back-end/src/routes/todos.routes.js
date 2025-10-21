import { Router } from "express";
import { verifyJWT } from "./../middlewares/auth.middleware.js";
import {
  createTodo,
  getUserTodos,
  getTodoById,
  getTodoByLabel,
  getUserLabels,
  updateTodo,
  updateLabel,
  deleteTodo,
  deleteLabel,
  deleteUserTodos,
  toggleTodoCompletion,
  toggleTodoArchive,
  getTodoStats,
  bulkUpdateTodos,
} from "./../controllers/todos.controller.js";

const router = Router();

// All routes are protected - require authentication
router.use(verifyJWT);

// Create and get User Labels
router.route("/").post(createTodo);

// get User Todos
router.route("/user/todos").get(getUserTodos).delete(deleteUserTodos);

// Get All User Labels
router.route("/user/labels").get(getUserLabels);

// Get todo statistics
router.route("/stats").get(getTodoStats);

// Bulk operations
router.route("/bulk").patch(bulkUpdateTodos);

// Get a specific todo by ID, Update a specific todo, Delete a specific todo
router.route("/:todoId").get(getTodoById).patch(updateTodo).delete(deleteTodo);

// Get Todo by label, update label and delete label
router
  .route("/label/:label")
  .get(getTodoByLabel)
  .patch(updateLabel)
  .delete(deleteLabel);

// Toggle todo completion status
router.route("/:todoId/toggle-completion").patch(toggleTodoCompletion);

// Toggle todo archive status
router.route("/:todoId/toggle-archive").patch(toggleTodoArchive);

export default router;
