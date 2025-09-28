export default function IncidentCard({ title }: { title: string }) {
  return (
    <div className="p-5 bg-green-500 rounded-2xl">
      <h1>{title}</h1>
    </div>
  );
}
