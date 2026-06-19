import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const seedDescription = 'Seed the octofit_db database with test data';

async function seedDatabase() {
  console.log(seedDescription);
  console.log(`Connecting to ${MONGODB_URI}`);

  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Team.deleteMany({}),
    User.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const teamIds = {
    trailblazers: new mongoose.Types.ObjectId(),
    coreCrew: new mongoose.Types.ObjectId(),
  };

  const userIds = {
    maya: new mongoose.Types.ObjectId(),
    jordan: new mongoose.Types.ObjectId(),
    priya: new mongoose.Types.ObjectId(),
    leo: new mongoose.Types.ObjectId(),
  };

  const teams = [
    {
      _id: teamIds.trailblazers,
      name: 'Trailblazers',
      mascot: 'Rocket Octopus',
      memberIds: [userIds.maya, userIds.jordan],
    },
    {
      _id: teamIds.coreCrew,
      name: 'Core Crew',
      mascot: 'Flexing Nautilus',
      memberIds: [userIds.priya, userIds.leo],
    },
  ];

  const users = [
    {
      _id: userIds.maya,
      username: 'maya_moves',
      email: 'maya.moves@example.com',
      displayName: 'Maya Chen',
      teamId: teamIds.trailblazers,
      profile: {
        fitnessGoal: 'Train for a spring half marathon',
        level: 'intermediate',
      },
    },
    {
      _id: userIds.jordan,
      username: 'jordan_lifts',
      email: 'jordan.lifts@example.com',
      displayName: 'Jordan Blake',
      teamId: teamIds.trailblazers,
      profile: {
        fitnessGoal: 'Build strength with consistent lifting',
        level: 'advanced',
      },
    },
    {
      _id: userIds.priya,
      username: 'priya_pace',
      email: 'priya.pace@example.com',
      displayName: 'Priya Shah',
      teamId: teamIds.coreCrew,
      profile: {
        fitnessGoal: 'Improve cardio endurance and mobility',
        level: 'beginner',
      },
    },
    {
      _id: userIds.leo,
      username: 'leo_cycles',
      email: 'leo.cycles@example.com',
      displayName: 'Leo Martinez',
      teamId: teamIds.coreCrew,
      profile: {
        fitnessGoal: 'Ride 100 miles in a weekend',
        level: 'intermediate',
      },
    },
  ];

  const activities = [
    {
      userId: userIds.maya,
      type: 'Outdoor run',
      durationMinutes: 42,
      caloriesBurned: 410,
      points: 82,
      loggedAt: new Date('2026-06-14T07:30:00.000Z'),
    },
    {
      userId: userIds.maya,
      type: 'Yoga flow',
      durationMinutes: 30,
      caloriesBurned: 140,
      points: 38,
      loggedAt: new Date('2026-06-16T18:15:00.000Z'),
    },
    {
      userId: userIds.jordan,
      type: 'Strength training',
      durationMinutes: 55,
      caloriesBurned: 360,
      points: 92,
      loggedAt: new Date('2026-06-15T12:00:00.000Z'),
    },
    {
      userId: userIds.priya,
      type: 'Brisk walk',
      durationMinutes: 35,
      caloriesBurned: 210,
      points: 45,
      loggedAt: new Date('2026-06-17T06:45:00.000Z'),
    },
    {
      userId: userIds.leo,
      type: 'Cycling',
      durationMinutes: 70,
      caloriesBurned: 620,
      points: 110,
      loggedAt: new Date('2026-06-18T09:00:00.000Z'),
    },
    {
      userId: userIds.leo,
      type: 'Mobility session',
      durationMinutes: 25,
      caloriesBurned: 95,
      points: 28,
      loggedAt: new Date('2026-06-18T19:30:00.000Z'),
    },
  ];

  const workouts = [
    {
      title: 'Starter Cardio Circuit',
      category: 'Cardio',
      level: 'beginner',
      durationMinutes: 25,
      exercises: ['Marching high knees', 'Step jacks', 'Bodyweight squats', 'Cooldown walk'],
    },
    {
      title: 'Runner Mobility Reset',
      category: 'Mobility',
      level: 'beginner',
      durationMinutes: 20,
      exercises: ['Hip circles', 'Worlds greatest stretch', 'Calf raises', 'Hamstring floss'],
    },
    {
      title: 'Tempo Run Builder',
      category: 'Running',
      level: 'intermediate',
      durationMinutes: 45,
      exercises: ['Warmup jog', 'Tempo intervals', 'Easy jog recovery', 'Stride finish'],
    },
    {
      title: 'Full Body Strength Ladder',
      category: 'Strength',
      level: 'intermediate',
      durationMinutes: 40,
      exercises: ['Goblet squats', 'Push presses', 'Renegade rows', 'Reverse lunges'],
    },
    {
      title: 'Power Lift Progression',
      category: 'Strength',
      level: 'advanced',
      durationMinutes: 60,
      exercises: ['Deadlifts', 'Bench press', 'Front squats', 'Weighted pullups'],
    },
  ];

  await Team.insertMany(teams);
  await User.insertMany(users);
  await Activity.insertMany(activities);
  await Workout.insertMany(workouts);

  const leaderboardEntries = Object.values(userIds).map((userId) => {
    const userActivities = activities.filter((activity) => activity.userId.equals(userId));

    return {
      userId,
      totalPoints: userActivities.reduce((total, activity) => total + activity.points, 0),
      totalCaloriesBurned: userActivities.reduce((total, activity) => total + activity.caloriesBurned, 0),
      totalDurationMinutes: userActivities.reduce((total, activity) => total + activity.durationMinutes, 0),
      activityCount: userActivities.length,
    };
  });

  await LeaderboardEntry.insertMany(leaderboardEntries);

  console.log(`Created ${users.length} users`);
  console.log(`Created ${teams.length} teams`);
  console.log(`Created ${activities.length} activities`);
  console.log(`Created ${leaderboardEntries.length} leaderboard entries`);
  console.log(`Created ${workouts.length} workouts`);
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });