export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="p-5 flex justify-between">
        <h1>CBDRA</h1>
        <nav></nav>
      </header>
      <div className="flex">
        {/* <aside className="p-5 w-full max-w-1/5">A Sidebar</aside> */}
        {children}
      </div>
    </>
  );
}
