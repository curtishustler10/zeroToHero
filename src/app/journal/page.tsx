import { CalendarClock, Feather, Mood, UploadCloud } from "lucide-react";

const recentEntries = [
  {
    date: "Jan 3",
    mood: "Calm",
    energy: "7/10",
    text: "Reduced caffeine. Gym felt strong. Wins: slept 7h, no cigarettes.",
  },
  {
    date: "Jan 2",
    mood: "Focused",
    energy: "8/10",
    text: "Finished programming session, hit pull-up milestone.",
  },
];

export default function JournalPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="pill">Reflection · fast</p>
            <h1 className="text-3xl sm:text-4xl">Journal</h1>
            <p className="text-[--muted]">
              One entry per day with prompts. Plus a quick scan upload for handwritten notes.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <CalendarClock className="h-4 w-4" />
            Auto-dates by day
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Quick entry</p>
              <h2 className="text-2xl">Text</h2>
            </div>
            <Feather className="h-5 w-5 text-emerald-600" />
          </div>
          <form className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-[--foreground]">Today&apos;s entry</span>
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/60 p-4 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                rows={4}
                placeholder="What did I do right today?"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-[--foreground]">Mood</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white/60 p-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Calm / Focused / Energized"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[--foreground]">Energy</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white/60 p-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="7 / 10"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["What did I do right today?", "What did I avoid?", "One action for tomorrow"].map(
                (prompt) => (
                  <div
                    key={prompt}
                    className="rounded-2xl border border-black/5 bg-slate-50/50 p-3 text-sm font-semibold text-[--muted]"
                  >
                    {prompt}
                  </div>
                ),
              )}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Save entry
            </button>
          </form>
        </div>

        <div className="card flex h-full flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Scan</p>
              <h2 className="text-xl">Photo upload</h2>
            </div>
            <UploadCloud className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-sm text-[--muted]">Drop a photo of your handwritten journal. Auto-dated.</p>
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-slate-50/50 p-6 text-center">
            <p className="text-sm font-semibold text-[--foreground]">Drag & drop or click to upload</p>
            <p className="text-xs text-[--muted]">PNG · JPG · HEIC</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
            Add scan
          </button>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">History</p>
            <h2 className="text-2xl">Recent entries</h2>
          </div>
          <Mood className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recentEntries.map((entry) => (
            <div key={entry.date} className="rounded-2xl border border-black/5 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{entry.date}</p>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {entry.mood} · {entry.energy}
                </span>
              </div>
              <p className="mt-2 text-sm text-[--muted]">{entry.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
