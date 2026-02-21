import { Request, Response } from "express";

import { Todo } from "../entities/Todo";
import db = require("../config/db");

const repo = db.AppDataSource.getRepository(Todo);

export const getTodos = async (req: Request, res: Response) => {
  const todos = await repo.find();
  res.json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const todo = repo.create(req.body);
  const result = await repo.save(todo);
  res.json(result);
};