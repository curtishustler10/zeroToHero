export default function AccountPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[--muted]">You</p>
          <h1 className="text-2xl font-semibold text-[--foreground]">Account & Settings</h1>
        </div>
      </header>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Profile</p>
            <p className="text-xs text-[--muted]">Manage name, email, and notifications.</p>
          </div>
          <span className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
            Edit
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Data & Export</p>
            <p className="text-xs text-[--muted]">Export your data or clear local cache.</p>
          </div>
          <span className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
            Manage
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Appearance</p>
            <p className="text-xs text-[--muted]">Light theme for now. Dark mode coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
