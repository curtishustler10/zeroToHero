import { Check, Edit3, Plus, User, X } from "lucide-react";

const summary = { daily: "4/5", weekly: "70%", monthly: "70%", total: "70%" };

const dailyHabits = [
  { name: "Weed-free", done: true },
  { name: "Smoke-free", done: true },
  { name: "Nuts-free", done: false },
];

export default function Home() {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Zero To Hero</h1>
          <p className="text-xs text-[--muted]">Supabase · personal</p>
        </div>
        <button className="rounded-full border border-gray-200 bg-white p-2 shadow-sm">
          <User className="h-5 w-5" />
        </button>
      </header>

      <section className="card p-4">
        <div className="grid grid-cols-2 gap-3">
          <PlaceholderCard title="Check account" />
          <PlaceholderCard title="Savings" />
          <PlaceholderCard title="Weekly charges" />
          <PlaceholderCard title="Monthly charges" />
          <PlaceholderCard title="Weekly goals" small />
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[--foreground]">Habits tracker</p>
            <button className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
              + Add
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-xs font-semibold text-gray-600">
            <SummaryCell label="D" value={summary.daily} bordered={false} />
            <SummaryCell label="W" value={summary.weekly} />
            <SummaryCell label="M" value={summary.monthly} />
            <SummaryCell label="T" value={summary.total} />
          </div>
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

      <section className="card p-4">
        <SectionHeader title="Goals" />
        <div className="placeholder-card" />
      </section>

      <section className="card p-4">
        <SectionHeader title="Bucket list" />
        <div className="placeholder-card" />
      </section>

      <section className="card p-4">
        <SectionHeader title="Memories" />
        <div className="placeholder-card" />
      </section>
    </div>
  );
}

function PlaceholderCard({ title, small }: { title: string; small?: boolean }) {
  return (
    <div
      className={`placeholder-card relative p-3 text-xs font-semibold uppercase text-gray-500 ${
        small ? "min-h-[90px]" : ""
      }`}
    >
      <div className="absolute right-2 top-2 rounded-full border border-gray-300 bg-white/80 p-1">
        <Edit3 className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <span className="block">{title}</span>
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
