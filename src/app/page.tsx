import { ArrowUpRight, BadgeCheck, CheckCircle2, Clock3, Flame, Minus, Plus } from "lucide-react";

const weeklyRecurring = [
  { name: "Spotify", amount: 7.99, weekday: "Mon", status: "paid" },
  { name: "Groceries budget", amount: 125, weekday: "Fri", status: "upcoming" },
  { name: "Therapy", amount: 90, weekday: "Wed", status: "paid" },
];

const monthlyRecurring = [
  { name: "Rent", amount: 1400, due: "5th", status: "upcoming" },
  { name: "Phone", amount: 55, due: "12th", status: "paid" },
  { name: "Internet", amount: 70, due: "18th", status: "upcoming" },
];

const habits = [
  { name: "Weed-free", done: true, streak: 14 },
  { name: "Smoke-free", done: true, streak: 28 },
  { name: "Nuts-free", done: false, streak: 3 },
  { name: "Meditation", done: true, detail: "12 min" },
  { name: "Gym", done: true, detail: "AM session" },
  { name: "Weight", done: true, detail: "72.4 kg" },
  { name: "Sleep", done: false, detail: "6.4 h" },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const weeklyTotal = weeklyRecurring.reduce((sum, item) => sum + item.amount, 0);
const monthlyTotal = monthlyRecurring.reduce((sum, item) => sum + item.amount, 0);

export default function Home() {
  const dailyScore = habits.filter((h) => h.done).length;
  const weeklyPercent = 78;
  const monthlyPercent = 72;

  return (
    <div className="space-y-10">
      <header className="card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="pill">Today · fast check-in</p>
            <h1 className="mt-3 text-3xl sm:text-4xl">Dashboard Overview</h1>
            <p className="mt-1 text-[--muted]">
              Money, habits, and health in one place. Designed to be updated in under a minute.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-lg">
            <Flame className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-wide">Clean day streak</p>
              <p className="text-2xl font-semibold">7 days</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatusCard
            title="Daily score"
            value={`${dailyScore} / 7`}
            accent="bg-orange-500/10 text-orange-700"
            sub="Perfect day badge unlocks at 7/7."
          />
          <StatusCard
            title="Weekly consistency"
            value={`${weeklyPercent}%`}
            accent="bg-emerald-500/10 text-emerald-700"
            sub="Targets: streaks + gym + clean habits."
          />
          <StatusCard
            title="Monthly consistency"
            value={`${monthlyPercent}%`}
            accent="bg-blue-500/10 text-blue-700"
            sub="Keep it above 70% to stay green."
          />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--muted]">
                Money
              </p>
              <h2 className="text-2xl">Cash + recurring</h2>
            </div>
            <span className="pill bg-orange-500/10 text-orange-700">
              Weekly total {formatCurrency(weeklyTotal)} · Monthly {formatCurrency(monthlyTotal)}
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <BalanceCard
              title="Checking"
              balance={3120.5}
              actions={[
                { label: "+ Add", icon: <Plus className="h-4 w-4" /> },
                { label: "– Withdraw", icon: <Minus className="h-4 w-4" /> },
              ]}
            />
            <BalanceCard
              title="Savings"
              balance={1820}
              goal={5000}
              actions={[
                { label: "+ Add", icon: <Plus className="h-4 w-4" /> },
                { label: "– Withdraw", icon: <Minus className="h-4 w-4" /> },
              ]}
            />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RecurringList
              title="Weekly recurring"
              items={weeklyRecurring}
              total={weeklyTotal}
              chip="Paid / upcoming"
            />
            <RecurringList
              title="Monthly recurring"
              items={monthlyRecurring}
              total={monthlyTotal}
              chip="Paid / upcoming"
            />
          </div>
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--muted]">
                Daily insight
              </p>
              <h3 className="text-xl">Streak + habits</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[--muted]" />
          </div>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-emerald-700">
              3 clean days · 2 gym sessions this week · keep sleep above 7h.
            </p>
            <ul className="space-y-2 text-sm text-[--muted]">
              <li>• “Perfect day” badge unlocks with nuts-free + 7h sleep.</li>
              <li>• Savings is 36% to the $5,000 goal.</li>
              <li>• Next payments: Rent (5th), Internet (18th).</li>
            </ul>
          </div>
          <button className="mt-auto inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700">
            Log today in 20 seconds
          </button>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--muted]">
              Habits + health
            </p>
            <h2 className="text-2xl">Today&apos;s check-in</h2>
          </div>
          <span className="pill bg-emerald-500/10 text-emerald-700">One check-in per day</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard key={habit.name} habit={habit} />
          ))}
        </div>
      </section>
    </div>
  );
}

type Habit = {
  name: string;
  done: boolean;
  streak?: number;
  detail?: string;
};

function HabitCard({ habit }: { habit: Habit }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-black/5 p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${
        habit.done ? "bg-emerald-50/70" : "bg-white"
      }`}
    >
      {habit.done ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
      ) : (
        <Clock3 className="mt-0.5 h-5 w-5 text-orange-500" />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{habit.name}</p>
          {habit.streak !== undefined && (
            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-700">
              {habit.streak} day streak
            </span>
          )}
        </div>
        <p className="text-sm text-[--muted]">
          {habit.detail ? habit.detail : habit.done ? "Done" : "Not done"}
        </p>
      </div>
    </div>
  );
}

function BalanceCard({
  title,
  balance,
  goal,
  actions,
}: {
  title: string;
  balance: number;
  goal?: number;
  actions: { label: string; icon: React.ReactNode }[];
}) {
  const progress = goal ? Math.min(100, Math.round((balance / goal) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-black/5 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[--muted]">
          {title}
        </p>
        <BadgeCheck className="h-5 w-5 text-emerald-600" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{formatCurrency(balance)}</p>
      {goal && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-[--muted]">
            <span>Goal: {formatCurrency(goal)}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-orange-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="inline-flex items-center gap-2 rounded-full border border-black/5 px-3 py-2 text-sm font-semibold text-[--foreground] transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:text-emerald-700"
            type="button"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type WeeklyRecurring = {
  name: string;
  amount: number;
  weekday?: string;
  due?: string;
  status: string;
};

function RecurringList({
  title,
  items,
  total,
  chip,
}: {
  title: string;
  items: WeeklyRecurring[];
  total: number;
  chip: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[--muted]">
            {title}
          </p>
          <p className="text-lg font-semibold">{formatCurrency(total)}</p>
        </div>
        <span className="pill bg-slate-100 text-[--foreground]">{chip}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 transition hover:border-black/5"
          >
            <div className="flex flex-col">
              <span className="font-semibold">{item.name}</span>
              <span className="text-sm text-[--muted]">
                {item.weekday ? item.weekday : item.due} · {item.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatCurrency(item.amount)}</span>
              <div
                className={`h-2 w-2 rounded-full ${
                  item.status === "paid" ? "bg-emerald-500" : "bg-orange-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusCard({
  title,
  value,
  sub,
  accent,
}: {
  title: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[--muted]">{title}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${accent}`}>{value}</span>
      </div>
      <p className="mt-2 text-sm text-[--muted]">{sub}</p>
    </div>
  );
}
