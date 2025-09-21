import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isArchieved: {
      type: Boolean,
      required: true,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
