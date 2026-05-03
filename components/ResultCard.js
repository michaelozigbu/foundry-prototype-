export default function ResultCard({ title, children, footer }) {
  return (
    <section className="rounded-lg p-6 card-shell">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-500">{title}</h2>
      </div>
      {children}
      {footer ? <div className="mt-5 border-t border-stone-100 pt-4 text-sm leading-6 text-stone-500">{footer}</div> : null}
    </section>
  );
}
