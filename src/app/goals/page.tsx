import { Camera, CheckCircle2, Clock4, FolderDown, ImageIcon, Mountain, Target } from "lucide-react";

const goals = [
  { name: "Savings → $5,000", current: 1820, target: 5000, deadline: "Mar 30", type: "money" },
  { name: "Target weight", current: 72.4, target: 68, unit: "kg", deadline: "Apr 15", type: "weight" },
  { name: "Gym 3× / week", current: 2, target: 3, unit: "sessions", type: "habit" },
  { name: "30 days weed-free", current: 14, target: 30, unit: "days", type: "streak" },
];

const bucket = [
  { title: "Iceland ring road", category: "Travel", status: "not_started" },
  { title: "Run a half-marathon", category: "Health", status: "in_progress" },
  { title: "Launch a paid side-product", category: "Business", status: "in_progress" },
  { title: "Get a strict pull-up", category: "Health", status: "done", done_date: "Jan 2" },
];

const memories = [
  {
    title: "Strict pull-up unlocked",
    completed_at: "Jan 2",
    photo: "/memories/pullup.jpg",
    caption: "Garage gym, after 12 weeks of small wins.",
  },
];

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="pill">Targets · no fluff</p>
            <h1 className="text-3xl sm:text-4xl">Goals & Memories</h1>
            <p className="text-[--muted]">
              Track measurable goals, and lock in memories with a required photo when you complete a bucket
              item.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <Target className="h-4 w-4" />
            Progress is proof
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Goals</p>
              <h2 className="text-2xl">Measurable + deadlines</h2>
            </div>
            <span className="pill bg-orange-500/10 text-orange-700">Auto-progress ready</span>
          </div>
          <div className="mt-4 space-y-3">
            {goals.map((goal) => (
              <GoalCard key={goal.name} goal={goal} />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Rule</p>
              <h2 className="text-xl">Memories need a photo</h2>
            </div>
            <Camera className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-[--muted]">
            Completing a bucket item will ask for an image upload. The item then moves down to the
            Memories section on this page.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            Upload memory photo
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Bucket list</p>
              <h2 className="text-2xl">Moves to memories when done</h2>
            </div>
            <FolderDown className="h-5 w-5 text-orange-600" />
          </div>
          <div className="mt-4 space-y-3">
            {bucket.map((item) => (
              <BucketCard key={item.title} item={item} />
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Memories</p>
              <h2 className="text-2xl">Proof with a photo</h2>
            </div>
            <ImageIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-4 space-y-4">
            {memories.map((memory) => (
              <div key={memory.title} className="flex gap-4 rounded-2xl border border-black/5 p-4 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-orange-400 text-white">
                  <Mountain className="h-7 w-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{memory.title}</p>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {memory.completed_at}
                    </span>
                  </div>
                  <p className="text-sm text-[--muted]">{memory.caption}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                    Photo stored in Supabase storage
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

type Goal = {
  name: string;
  current: number;
  target: number;
  unit?: string;
  deadline?: string;
  type: string;
};

function GoalCard({ goal }: { goal: Goal }) {
  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
  return (
    <div className="rounded-2xl border border-black/5 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{goal.name}</p>
          <p className="text-sm text-[--muted]">
            {goal.current}
            {goal.unit ? ` ${goal.unit}` : ""} → {goal.target}
            {goal.unit ? ` ${goal.unit}` : ""} {goal.deadline ? `· by ${goal.deadline}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
          {goal.type}
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-orange-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

type BucketItem = {
  title: string;
  category: string;
  status: string;
  done_date?: string;
};

function BucketCard({ item }: { item: BucketItem }) {
  const statusColor =
    item.status === "done"
      ? "bg-emerald-500/10 text-emerald-700"
      : item.status === "in_progress"
        ? "bg-orange-500/10 text-orange-700"
        : "bg-slate-200 text-slate-700";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 p-4 shadow-sm">
      <div>
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-[--muted]">{item.category}</p>
        {item.status === "done" && item.done_date ? (
          <p className="text-xs font-semibold text-emerald-700">Completed on {item.done_date}</p>
        ) : (
          <p className="text-xs font-semibold text-orange-700">Photo upload required when done</p>
        )}
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>{item.status}</span>
    </div>
  );
}
