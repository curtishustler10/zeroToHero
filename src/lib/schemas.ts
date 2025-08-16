import { z } from "zod";

// Base schemas
export const profileSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  tz: z.string().default("Australia/Brisbane"),
  display_name: z.string().nullable(),
  goal_desc: z.string().nullable(),
});

export const daySchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  mood: z.number().int().min(1).max(5).nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const habitSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  target: z.number().int().positive(),
  unit: z.string().min(1),
  is_active: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.string().datetime(),
});

export const habitLogSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  habit_id: z.number(),
  date: z.string().date(),
  value: z.number().int().min(0),
  created_at: z.string().datetime(),
});

export const contentLogSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  kind: z.string().min(1),
  url: z.string().url().nullable(),
  caption: z.string().nullable(),
  minutes_spent: z.number().int().min(0),
  created_at: z.string().datetime(),
});

export const deepworkLogSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  start_time: z.string().datetime(),
  minutes: z.number().int().positive(),
  tag: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const socialRepsSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  count: z.number().int().min(0),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const workoutSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  type: z.string().min(1),
  duration_min: z.number().int().positive().nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const sleepLogSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  hours: z.number().positive(),
  quality: z.number().int().min(1).max(5).nullable(),
  created_at: z.string().datetime(),
});

export const leadSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  business: z.string().nullable(),
  niche: z.string().nullable(),
  source: z.string().nullable(),
  status: z.enum(["New", "Contacted", "Booked", "Won", "Lost"]),
  priority: z.number().int().min(1).max(5),
  next_action_date: z.string().date().nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const outreachLogSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  lead_id: z.number().nullable(),
  date: z.string().date(),
  channel: z.string().min(1),
  notes: z.string().nullable(),
  outcome: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const dealSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  lead_id: z.number().nullable(),
  amount: z.number().positive(),
  cogs: z.number().min(0).nullable(),
  date: z.string().date(),
  source: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const storySchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string().date(),
  archetype: z.enum(["contrast", "tiny_win", "failure", "vow"]),
  sensory_detail: z.string().nullable(),
  conflict: z.string().nullable(),
  turning_point: z.string().nullable(),
  lesson: z.string().nullable(),
  draft: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const eventSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  time: z.string().datetime(),
  name: z.string().min(1),
  payload: z.record(z.any()).nullable(),
});

export const promptSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid().nullable(),
  kind: z.string().min(1),
  text: z.string().min(1),
  weight: z.number().int().positive(),
  created_at: z.string().datetime(),
});

// Input schemas for forms (without generated fields)
export const profileInputSchema = profileSchema.omit({
  id: true,
  created_at: true,
});

export const dayInputSchema = daySchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const habitInputSchema = habitSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const habitLogInputSchema = habitLogSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const contentLogInputSchema = contentLogSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const deepworkLogInputSchema = deepworkLogSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const socialRepsInputSchema = socialRepsSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const workoutInputSchema = workoutSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const sleepLogInputSchema = sleepLogSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const leadInputSchema = leadSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const outreachLogInputSchema = outreachLogSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const dealInputSchema = dealSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const storyInputSchema = storySchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const eventInputSchema = eventSchema.omit({
  id: true,
  user_id: true,
  time: true,
});

export const promptInputSchema = promptSchema.omit({
  id: true,
  created_at: true,
});

// AI Draft schemas
export const aiDraftInputSchema = z.object({
  archetype: z.enum(["contrast", "tiny_win", "failure", "vow"]),
  sensory_detail: z.string().min(1),
  conflict: z.string().min(1),
  turning_point: z.string().min(1),
  lesson: z.string().min(1),
  call_to_action: z.string().optional(),
});

export const aiDraftOutputSchema = z.object({
  post: z.string().min(150).max(220),
  reel_caption: z.string().min(60).max(90),
  hashtags: z.array(z.string()),
});

// Quick add schemas
export const quickAddContentSchema = z.object({
  kind: z.string().min(1),
  url: z.string().url().optional(),
  caption: z.string().optional(),
  minutes_spent: z.number().int().min(0).default(0),
});

export const quickAddDeepWorkSchema = z.object({
  minutes: z.number().int().positive(),
  tag: z.string().optional(),
});

export const quickAddRepSchema = z.object({
  count: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export const quickAddWorkoutSchema = z.object({
  type: z.string().min(1),
  duration_min: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const quickAddSleepSchema = z.object({
  hours: z.number().positive(),
  quality: z.number().int().min(1).max(5).optional(),
});

export const quickAddRevenueSchema = z.object({
  amount: z.number().positive(),
  cogs: z.number().min(0).optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  lead_id: z.number().optional(),
});

export const quickAddLeadSchema = z.object({
  name: z.string().min(1),
  business: z.string().optional(),
  niche: z.string().optional(),
  source: z.string().optional(),
  priority: z.number().int().min(1).max(5).default(3),
});

// Update schemas
export const updateProfileSchema = profileInputSchema.partial();
export const updateHabitSchema = habitInputSchema.partial();
export const updateLeadSchema = leadInputSchema.partial();
export const updateStorySchema = storyInputSchema.partial();

// Type exports
export type Profile = z.infer<typeof profileSchema>;
export type Day = z.infer<typeof daySchema>;
export type Habit = z.infer<typeof habitSchema>;
export type HabitLog = z.infer<typeof habitLogSchema>;
export type ContentLog = z.infer<typeof contentLogSchema>;
export type DeepworkLog = z.infer<typeof deepworkLogSchema>;
export type SocialReps = z.infer<typeof socialRepsSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type SleepLog = z.infer<typeof sleepLogSchema>;
export type Lead = z.infer<typeof leadSchema>;
export type OutreachLog = z.infer<typeof outreachLogSchema>;
export type Deal = z.infer<typeof dealSchema>;
export type Story = z.infer<typeof storySchema>;
export type Event = z.infer<typeof eventSchema>;
export type Prompt = z.infer<typeof promptSchema>;

export type ProfileInput = z.infer<typeof profileInputSchema>;
export type DayInput = z.infer<typeof dayInputSchema>;
export type HabitInput = z.infer<typeof habitInputSchema>;
export type HabitLogInput = z.infer<typeof habitLogInputSchema>;
export type ContentLogInput = z.infer<typeof contentLogInputSchema>;
export type DeepworkLogInput = z.infer<typeof deepworkLogInputSchema>;
export type SocialRepsInput = z.infer<typeof socialRepsInputSchema>;
export type WorkoutInput = z.infer<typeof workoutInputSchema>;
export type SleepLogInput = z.infer<typeof sleepLogInputSchema>;
export type LeadInput = z.infer<typeof leadInputSchema>;
export type OutreachLogInput = z.infer<typeof outreachLogInputSchema>;
export type DealInput = z.infer<typeof dealInputSchema>;
export type StoryInput = z.infer<typeof storyInputSchema>;

export type AiDraftInput = z.infer<typeof aiDraftInputSchema>;
export type AiDraftOutput = z.infer<typeof aiDraftOutputSchema>;

export type QuickAddContent = z.infer<typeof quickAddContentSchema>;
export type QuickAddDeepWork = z.infer<typeof quickAddDeepWorkSchema>;
export type QuickAddRep = z.infer<typeof quickAddRepSchema>;
export type QuickAddWorkout = z.infer<typeof quickAddWorkoutSchema>;
export type QuickAddSleep = z.infer<typeof quickAddSleepSchema>;
export type QuickAddRevenue = z.infer<typeof quickAddRevenueSchema>;
export type QuickAddLead = z.infer<typeof quickAddLeadSchema>;