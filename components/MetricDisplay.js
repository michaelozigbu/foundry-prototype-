export default function MetricDisplay({ label, value, tone = "neutral", detail }) {
  const toneClasses = {
    neutral: "text-stone-950",
    positive: "text-[#2f6f57]",
    warning: "text-[#9f681d]",
    danger: "text-[#a13c32]",
  };

  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className={`metric-value mt-2 text-3xl font-black tracking-tight ${toneClasses[tone]}`}>
        {value}
      </p>
      {detail ? <p className="mt-2 text-sm leading-6 text-stone-500">{detail}</p> : null}
    </div>
  );
}
