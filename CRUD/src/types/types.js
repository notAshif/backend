const { z } = require("zod");

const signUpSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be minimum 6 characters." }),
});

const signInSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be minimum 6 characters." }),
});

const CreateWorkspaceSchema = z.object({
  name: z.string(),
});

const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const markCompleteSchema = z.object({
  completed: z.boolean(),
})

module.exports = {
  signUpSchema,
  signInSchema,
  CreateWorkspaceSchema,
  CreateTaskSchema,
  markCompleteSchema
};
