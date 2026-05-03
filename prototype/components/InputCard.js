export default function InputCard({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = 1,
  helper,
  variant = "card",
}) {
  const wrapperClass =
    variant === "compact"
      ? "block"
      : "block rounded-lg p-5 card-shell";

  return (
    <label className={wrapperClass}>
      <span className="block text-sm font-bold text-stone-950">{label}</span>
      <span className="mt-1 block text-sm leading-6 text-stone-500">{helper}</span>
      <div className="mt-4 flex items-center rounded-md border border-stone-200 bg-stone-50/80 px-3 transition duration-200 focus-within:border-stone-900 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(154,79,47,0.10)]">
        {prefix ? <span className="text-sm font-semibold text-stone-500">{prefix}</span> : null}
        <input
          className="metric-value h-11 w-full bg-transparent px-2 text-base font-bold text-stone-950 outline-none"
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix ? <span className="text-sm font-semibold text-stone-500">{suffix}</span> : null}
      </div>
    </label>
  );
}
