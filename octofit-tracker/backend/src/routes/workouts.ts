import { Router } from 'express';
import { Workout } from '../models.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { level } = req.query;
    const query = typeof level === 'string' ? { level } : {};
    const workouts = await Workout.find(query).sort({ level: 1, title: 1 });
    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
});

export default router;