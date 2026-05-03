export default function SimulatorSection({ title, description, children, result }) {
  return (
    <section className="rounded-lg p-5 card-shell">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-black text-stone-950">{title}</h3>
        <p className="text-sm leading-6 text-stone-500">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
      <div className="mt-5 rounded-md border border-stone-200 bg-stone-50/75 p-4">{result}</div>
    </section>
  );
}
