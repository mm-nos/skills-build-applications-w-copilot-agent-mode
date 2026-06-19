import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    displayName: { type: String, required: true, trim: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    profile: {
      fitnessGoal: { type: String, default: 'Build a consistent training habit' },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    mascot: { type: String, required: true, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    points: { type: Number, required: true, min: 0 },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true },
);

const leaderboardEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalPoints: { type: Number, required: true, min: 0, default: 0 },
    totalCaloriesBurned: { type: Number, required: true, min: 0, default: 0 },
    totalDurationMinutes: { type: Number, required: true, min: 0, default: 0 },
    activityCount: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const Workout = mongoose.model('Workout', workoutSchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);