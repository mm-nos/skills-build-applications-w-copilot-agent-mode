import { Router } from 'express';
import { Team } from '../models.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const teams = await Team.find().populate('memberIds', 'username displayName').sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
});

export default router;