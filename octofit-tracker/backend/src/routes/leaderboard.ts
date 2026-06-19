import { Router } from 'express';
import { Activity, LeaderboardEntry } from '../models.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
          totalCaloriesBurned: { $sum: '$caloriesBurned' },
          totalDurationMinutes: { $sum: '$durationMinutes' },
          activityCount: { $sum: 1 },
        },
      },
      { $sort: { totalPoints: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$user.username',
          displayName: '$user.displayName',
          totalPoints: 1,
          totalCaloriesBurned: 1,
          totalDurationMinutes: 1,
          activityCount: 1,
        },
      },
    ]);

    if (leaderboard.length > 0) {
      res.json(leaderboard.map((entry, index) => ({ rank: index + 1, ...entry })));
      return;
    }

    const savedLeaderboard = await LeaderboardEntry.find()
      .populate('userId', 'username displayName')
      .sort({ totalPoints: -1 });

    res.json(savedLeaderboard.map((entry, index) => ({ rank: index + 1, ...entry.toObject() })));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const leaderboardEntry = await LeaderboardEntry.create(req.body);
    res.status(201).json(leaderboardEntry);
  } catch (error) {
    next(error);
  }
});

export default router;