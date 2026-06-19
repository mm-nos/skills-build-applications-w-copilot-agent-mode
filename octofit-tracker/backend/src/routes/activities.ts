import { Router } from 'express';
import { Activity } from '../models.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'username displayName')
      .sort({ loggedAt: -1 });
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
});

export default router;