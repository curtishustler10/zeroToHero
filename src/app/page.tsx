import Link from "next/link";
import { Check, Clock3, Edit3, Plus, User, X } from "lucide-react";

const summary = { daily: "4/5", weekly: "70%", monthly: "70%", total: "70%" };

const dailyHabits = [
  { name: "Weed-free", done: true },
  { name: "Smoke-free", done: true },
  { name: "Nuts-free", done: false },
];

const accounts = [
  { title: "Check account", amount: "$3,120.50" },
  { title: "Savings", amount: "$1,820.00", sub: "Goal: $5,000" },
];

const recurringCharges = [
  { label: "Groceries", amount: "$125", status: "upcoming", cadence: "Weekly" },
  { label: "Therapy", amount: "$90", status: "paid", cadence: "Weekly" },
  { label: "Rent", amount: "$1,400", status: "upcoming", cadence: "Monthly" },
  { label: "Internet", amount: "$70", status: "upcoming", cadence: "Monthly" },
];

const weeklyGoals = ["Gym 3×", "Meditation 5×", "No cigarettes", "Sleep avg 7h"];

export default function Home() {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Zero To Hero</h1>
          <p className="text-xs text-[--muted]">Supabase · personal</p>
        </div>
        <Link
          href="/account"
          className="rounded-full border border-gray-200 bg-white p-2 shadow-sm"
          aria-label="Open account settings"
        >
          <User className="h-5 w-5" />
        </Link>
      </header>

      <section className="card p-4">
        <div className="grid grid-cols-2 gap-3">
          {accounts.map((account) => (
            <DataCard key={account.title} title={account.title} value={account.amount} sub={account.sub} />
          ))}
          <div className="col-span-2">
            <ListCard title="Recurring charges" items={recurringCharges} showCadence />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full bg-emerald-400" />
            Weekly
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full bg-blue-400" />
            Monthly
          </div>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[--foreground]">Weekly goals</p>
          <button className="rounded-full bg-[--gray-soft] p-2 text-gray-700">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">
          <BulletCard title="This week" items={weeklyGoals} />
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[--foreground]">Habits tracker</p>
          <button className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
            + Add
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 text-center text-xs font-semibold text-gray-600">
          <SummaryCell label="D" value={summary.daily} bordered={false} />
          <SummaryCell label="W" value={summary.weekly} />
          <SummaryCell label="M" value={summary.monthly} />
          <SummaryCell label="T" value={summary.total} />
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-[--foreground]">Daily habits</p>
            <button className="rounded-full bg-[--gray-soft] p-2 text-gray-700">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {dailyHabits.map((habit) => (
              <HabitRow key={habit.name} name={habit.name} done={habit.done} />
            ))}
          </div>
        </div>
      </section>

      {/* Goals, bucket list, and memories removed on request */}
    </div>
  );
}

function HabitRow({ name, done }: { name: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold">
      <p className="text-[--foreground]">{name}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`flex h-7 w-7 items-center justify-center rounded-md border ${
            done ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, bordered = true }: { label: string; value: string; bordered?: boolean }) {
  return (
    <div className={bordered ? "border-l border-gray-200" : ""}>
      <p className="text-gray-500">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-[--foreground]">{title}</h2>
      <button className="rounded-full bg-[--gray-soft] p-2 text-gray-700">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function DataCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="absolute right-2 top-2 rounded-full border border-gray-200 bg-white/80 p-1">
        <Edit3 className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
      <p className="mt-1 text-lg font-semibold text-[--foreground]">{value}</p>
      {sub && <p className="text-xs text-[--muted]">{sub}</p>}
    </div>
  );
}

type ListItem = { label: string; amount: string; status?: string; cadence?: string };

function ListCard({ title, items, showCadence = false }: { title: string; items: ListItem[]; showCadence?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
        <Edit3 className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-2">
              {showCadence && item.cadence && (
                <span
                  className={`h-6 w-1 rounded-full ${item.cadence === "Weekly" ? "bg-emerald-400" : "bg-blue-400"}`}
                  aria-hidden
                />
              )}
              <span className="text-[--foreground]">{item.label}</span>
            </div>
            <span className="text-gray-600">
              {item.amount}
              {item.status === "upcoming" ? (
                <Clock3 className="ml-2 inline h-4 w-4 text-gray-500" />
              ) : item.status ? (
                ` · ${item.status}`
              ) : (
                ""
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
        <Edit3 className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <ul className="mt-2 space-y-1 text-sm font-semibold text-[--foreground]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RowCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
      <p className="text-sm font-semibold text-[--foreground]">{title}</p>
      <span className="text-xs font-semibold text-gray-600">{value}</span>
    </div>
  );
}
