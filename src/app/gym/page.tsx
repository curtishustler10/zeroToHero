import { Activity, ArrowRight, ClipboardList, Dumbbell, Play, TrendingUp } from "lucide-react";

const programs = [
  { name: "Split Dos Biceps", focus: "Back + biceps", sessions: 8 },
  { name: "Split Pec Triceps", focus: "Chest + triceps", sessions: 6 },
  { name: "Legs", focus: "Quads · glutes · hamstrings", sessions: 4 },
];

const plan = {
  name: "Split Pec Triceps",
  exercises: [
    { name: "Seated Overhead Press (Barre)", sets: 3 },
    { name: "Dips", sets: 3 },
    { name: "Cable Fly", sets: 4 },
  ],
};

const activeWorkout = {
  program: "Split Pec Triceps",
  timer: "12:48",
  exercise: "Seated Overhead Press (Barre)",
  sets: [
    { set: 1, prev: "42.5 kg · 10", weight: "45 kg", reps: 10, done: true },
    { set: 2, prev: "45 kg · 9", weight: "45 kg", reps: 9, done: true },
    { set: 3, prev: "45 kg · 8", weight: "45 kg", reps: 0, done: false },
  ],
};

export default function GymPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="pill">Programs → workouts → sets</p>
            <h1 className="text-3xl sm:text-4xl">Gym</h1>
            <p className="text-[--muted]">
              Pick a program, start a workout, log sets with a live timer, and see history in a dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <Dumbbell className="h-4 w-4" />
            Includes “Ancien” per exercise
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">
                Programs library
              </p>
              <h2 className="text-2xl">Pick or edit</h2>
            </div>
            <ClipboardList className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.name} program={program} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-black/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Plan</p>
                <h3 className="text-xl">{plan.name}</h3>
              </div>
              <button className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[--foreground] hover:border-emerald-500/50">
                Modify
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {plan.exercises.map((exercise, idx) => (
                <li
                  key={exercise.name}
                  className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 transition hover:border-black/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-700">
                      {idx + 1}
                    </span>
                    <p className="font-semibold">{exercise.name}</p>
                  </div>
                  <p className="text-sm text-[--muted]">{exercise.sets} sets</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                Start workout
              </button>
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Instructions</p>
              <h2 className="text-xl">Exercise detail</h2>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-600" />
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-orange-50 p-4">
            <p className="font-semibold">Seated Overhead Press (Barre)</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[--muted]">
              <li>Brace, set seat height so forearms stay vertical.</li>
              <li>Press without shrugging, slow eccentric.</li>
              <li>90 seconds rest between sets.</li>
            </ol>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
            Add note
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">
                Workout session
              </p>
              <h2 className="text-2xl">Player / Logger</h2>
            </div>
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700">
              Live timer {activeWorkout.timer}
            </span>
          </div>
          <div className="mt-4 rounded-2xl border border-black/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--muted]">Program</p>
                <p className="text-lg font-semibold">{activeWorkout.program}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
                <Play className="h-4 w-4" />
                Next exercise
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-[--foreground]">Current: {activeWorkout.exercise}</p>
              <p className="text-xs text-[--muted]">Columns: Set # · Ancien · kg · reps · done</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-black/5">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[--muted]">
                    <tr>
                      <th className="px-4 py-2">Set</th>
                      <th className="px-4 py-2">Previous (Ancien)</th>
                      <th className="px-4 py-2">kg</th>
                      <th className="px-4 py-2">Reps</th>
                      <th className="px-4 py-2">Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeWorkout.sets.map((set) => (
                      <tr key={set.set} className="border-t border-black/5">
                        <td className="px-4 py-3 font-semibold">{set.set}</td>
                        <td className="px-4 py-3 text-[--muted]">{set.prev}</td>
                        <td className="px-4 py-3">{set.weight}</td>
                        <td className="px-4 py-3">{set.reps || "—"}</td>
                        <td className="px-4 py-3">
                          {set.done ? (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Done
                            </span>
                          ) : (
                            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
                  Previous
                </button>
                <button className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
                  Next
                </button>
                <button className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
                  Rest timer 90s
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--muted]">Progress</p>
              <h2 className="text-xl">Dashboard</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-50 to-orange-50 p-4 shadow-sm">
            <p className="text-sm font-semibold text-[--muted]">Workouts/week</p>
            <div className="mt-3 flex items-end gap-2">
              {[2, 3, 2, 4, 3, 0, 1].map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 rounded-t-lg bg-emerald-500/80"
                    style={{ height: `${16 + value * 8}px` }}
                  />
                  <span className="text-[10px] text-[--muted]">W{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <InfoPill title="Weight trend" value="72.4 → 71.9 kg" icon={<Activity className="h-4 w-4" />} />
            <InfoPill title="Body fat trend" value="17.2% → 16.9%" icon={<TrendingUp className="h-4 w-4" />} />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
            Export workout data
          </button>
        </div>
      </section>
    </div>
  );
}

type Program = {
  name: string;
  focus: string;
  sessions: number;
};

function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="rounded-2xl border border-black/5 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{program.name}</p>
          <p className="text-sm text-[--muted]">{program.focus}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
          {program.sessions} sessions
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
          Start
        </button>
        <button className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
          Edit
        </button>
        <button className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[--foreground] hover:border-emerald-500/40">
          …
        </button>
      </div>
    </div>
  );
}

function InfoPill({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-black/5 p-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--muted]">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
