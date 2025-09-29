export default async function AdminDashboardPage() {
  return (
    <main className="p-5">
      <section className="space-y-5">
        <h2 className="font-bold text-2xl">Recent Incidents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
      </section>
    </main>
  );
}
