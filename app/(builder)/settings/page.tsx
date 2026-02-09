export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Display Name</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Your Name"
              disabled
            />
            <p className="text-xs text-muted mt-1">Managed by your provider (Google/GitHub/Admin)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors opacity-60"
              placeholder="email@example.com"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-4">Application</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted">Manage your visual preference</p>
            </div>
            {/* Theme toggle is in header, but could be here too */}
            <div className="text-sm text-muted">Use header toggle</div>
          </div>
        </div>
      </div>
    </div>
  );
}
