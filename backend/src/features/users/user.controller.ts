import { Request, Response } from 'express';
import * as UserService from './user.service';

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserService.fetchAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await UserService.fetchUser(id);
  res.json(user);
};

export const promoteToCreator = async (req: Request, res: Response) => {
  res.send('Constucton');
};

export const getUserPlans = async (req: Request, res: Response) => {
  res.send('Constucton');
};
