import { Router } from 'express';
import { User } from '../models.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find().populate('teamId', 'name mascot').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

export default router;