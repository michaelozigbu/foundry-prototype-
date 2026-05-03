"use client";

import { useMemo, useState } from "react";
import InputCard from "@/components/InputCard";
import MetricDisplay from "@/components/MetricDisplay";
import ResultCard from "@/components/ResultCard";
import SimulatorSection from "@/components/SimulatorSection";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function calculateRunway(cash, revenue, expenses) {
  const burn = expenses - revenue;
  if (burn <= 0) return Infinity;
  return cash / burn;
}

function formatRunway(months) {
  if (!Number.isFinite(months)) return "Profitable";
  return `${months.toFixed(1)} mo`;
}

function getRiskLevel(runway) {
  if (!Number.isFinite(runway)) return "Safe";
  if (runway < 3) return "High";
  if (runway <= 6) return "Medium";
  return "Safe";
}

function riskTone(risk) {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warning";
  return "positive";
}

export default function DashboardPage() {
  const [mrr, setMrr] = useState(12000);
  const [expenses, setExpenses] = useState(9000);
  const [cash, setCash] = useState(52000);
  const [growthRate, setGrowthRate] = useState(6);
  const [churnRate, setChurnRate] = useState(3);
  const [desiredSalary, setDesiredSalary] = useState(3000);
  const [newHireCost, setNewHireCost] = useState(4500);
  const [simulatedChurn, setSimulatedChurn] = useState(8);

  const metrics = useMemo(() => {
    const profit = mrr - expenses;
    const runway = calculateRunway(cash, mrr, expenses);
    const risk = getRiskLevel(runway);
    const nextMonthRevenue = mrr * (1 + growthRate / 100) * (1 - churnRate / 100);

    const salaryExpenses = expenses + desiredSalary;
    const salaryRunway = calculateRunway(cash, mrr, salaryExpenses);

    const hireExpenses = expenses + newHireCost;
    const hireBurn = Math.max(hireExpenses - mrr, 0);
    const hireRunway = calculateRunway(cash, mrr, hireExpenses);

    const churnedRevenue = mrr * (1 - simulatedChurn / 100);
    const churnRunway = calculateRunway(cash, churnedRevenue, expenses);
    const burn = Math.max(expenses - mrr, 0);
    const salaryBurn = Math.max(salaryExpenses - mrr, 0);
    const churnBurn = Math.max(expenses - churnedRevenue, 0);

    return {
      burn,
      profit,
      runway,
      risk,
      nextMonthRevenue,
      salaryBurn,
      salaryRunway,
      hireBurn,
      hireRunway,
      churnedRevenue,
      churnBurn,
      churnRunway,
    };
  }, [cash, churnRate, desiredSalary, expenses, growthRate, mrr, newHireCost, simulatedChurn]);

  const riskClasses = {
    High: "border-red-200 bg-red-50 text-red-800",
    Medium: "border-amber-200 bg-amber-50 text-amber-800",
    Safe: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  return (
    <main className="min-h-screen overflow-x-hidden px-5 py-7 text-stone-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-stone-200/80 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="brand-pill inline-flex items-center gap-3 rounded-full px-3 py-2 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9a4f2f]" />
              <p className="text-xs font-black uppercase tracking-[0.18em]">Foundry Finance</p>
            </div>
            <h1 className="foundry-title mt-5 text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl sm:leading-[1.02]">
              Financial decisions for solo SaaS founders.
            </h1>
            <p className="foundry-muted mt-4 max-w-2xl text-base leading-7">
              Model runway, profit, salary, hiring, and churn with live assumptions that stay easy to read.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white/90 px-5 py-4 shadow-[0_14px_45px_rgba(56,42,32,0.08)]">
            <p className="text-sm font-semibold text-stone-500">Next month projected MRR</p>
            <p className="metric-value mt-1 text-3xl font-black text-stone-950">{currency.format(metrics.nextMonthRevenue)}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full w-2/3 rounded-full bg-[#9a4f2f] transition-all duration-500" />
            </div>
          </div>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[420px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="dark-panel rounded-lg border border-stone-900 p-5 shadow-[0_22px_65px_rgba(56,42,32,0.18)]">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Planning inputs</p>
              <p className="dark-panel-muted mt-3 text-sm leading-6">
                Tune the core assumptions and every decision card updates instantly.
              </p>
            </div>
            <InputCard label="Monthly Revenue" helper="Current MRR before growth and churn." value={mrr} onChange={setMrr} prefix="$" />
            <InputCard label="Monthly Expenses" helper="Fixed monthly operating costs." value={expenses} onChange={setExpenses} prefix="$" />
            <InputCard label="Cash Balance" helper="Available cash in the bank." value={cash} onChange={setCash} prefix="$" />
            <InputCard label="Growth Rate" helper="Expected monthly revenue growth." value={growthRate} onChange={setGrowthRate} suffix="%" step={0.1} />
            <InputCard label="Churn Rate" helper="Expected monthly customer churn." value={churnRate} onChange={setChurnRate} suffix="%" step={0.1} />
          </aside>

          <section className="min-w-0 space-y-6">
            <ResultCard
              title="Financial Dashboard"
              footer="Runway uses cash divided by monthly burn. If revenue covers expenses, runway is shown as profitable."
            >
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-md border border-stone-100 bg-stone-50/60 p-5">
                  <MetricDisplay label="Runway" value={formatRunway(metrics.runway)} detail="Months of cash remaining at current burn." />
                </div>
                <div className="rounded-md border border-stone-100 bg-stone-50/60 p-5">
                  <MetricDisplay
                    label="Profit or Loss"
                    value={currency.format(metrics.profit)}
                    tone={metrics.profit >= 0 ? "positive" : "danger"}
                    detail={metrics.profit >= 0 ? "Revenue is covering monthly costs." : "Expenses are above current MRR."}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-500">Risk Level</p>
                  <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-black ${riskClasses[metrics.risk]}`}>
                    {metrics.risk}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    {metrics.risk === "High" ? "Act now to extend cash." : metrics.risk === "Medium" ? "Be selective with new commitments." : "You have room to plan."}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-3">
                <div className="rounded-md bg-white p-4 ring-1 ring-stone-100">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Current burn</p>
                  <p className="metric-value mt-2 text-xl font-black">{currency.format(metrics.burn)}</p>
                </div>
                <div className="rounded-md bg-white p-4 ring-1 ring-stone-100">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Growth</p>
                  <p className="metric-value mt-2 text-xl font-black text-[#2f6f57]">{growthRate.toFixed(1)}%</p>
                </div>
                <div className="rounded-md bg-white p-4 ring-1 ring-stone-100">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Base churn</p>
                  <p className="metric-value mt-2 text-xl font-black text-[#9f681d]">{churnRate.toFixed(1)}%</p>
                </div>
              </div>
            </ResultCard>

            <div className="grid gap-6 xl:grid-cols-3">
              <SimulatorSection
                title="Salary Planner"
                description="Add founder pay to monthly expenses."
                result={
                  <div>
                    <MetricDisplay
                      label="Updated Runway"
                      value={formatRunway(metrics.salaryRunway)}
                      tone={riskTone(getRiskLevel(metrics.salaryRunway))}
                    />
                    {metrics.salaryRunway < 6 ? (
                      <p className="mt-3 text-sm font-bold text-[#a13c32]">Warning: runway falls below 6 months.</p>
                    ) : (
                      <p className="mt-3 text-sm text-stone-500">Salary fits the current runway target.</p>
                    )}
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-[#2f6f57] transition-all duration-500" style={{ width: `${Math.min(metrics.salaryRunway * 10, 100)}%` }} />
                    </div>
                  </div>
                }
              >
                <InputCard label="Desired Salary" helper="Monthly founder salary." value={desiredSalary} onChange={setDesiredSalary} prefix="$" variant="compact" />
              </SimulatorSection>

              <SimulatorSection
                title="Hiring Simulator"
                description="Model the cost of one additional hire."
                result={
                  <div className="space-y-4">
                    <MetricDisplay label="Updated Burn" value={currency.format(metrics.hireBurn)} detail="Monthly cash burn after the hire." />
                    <MetricDisplay label="Updated Runway" value={formatRunway(metrics.hireRunway)} tone={riskTone(getRiskLevel(metrics.hireRunway))} />
                    <div className="h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-[#9a4f2f] transition-all duration-500" style={{ width: `${Math.min(metrics.hireBurn / Math.max(expenses + newHireCost, 1) * 100, 100)}%` }} />
                    </div>
                  </div>
                }
              >
                <InputCard label="New Hire Cost" helper="Fully loaded monthly cost." value={newHireCost} onChange={setNewHireCost} prefix="$" variant="compact" />
              </SimulatorSection>

              <SimulatorSection
                title="Churn Simulator"
                description="Stress-test revenue after churn."
                result={
                  <div className="space-y-4">
                    <MetricDisplay label="Updated Revenue" value={currency.format(metrics.churnedRevenue)} detail="MRR after simulated churn." />
                    <MetricDisplay label="Updated Runway" value={formatRunway(metrics.churnRunway)} tone={riskTone(getRiskLevel(metrics.churnRunway))} />
                    <div className="h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-[#9f681d] transition-all duration-500" style={{ width: `${Math.min(simulatedChurn, 100)}%` }} />
                    </div>
                  </div>
                }
              >
                <InputCard label="Simulated Churn" helper="Revenue churn to apply." value={simulatedChurn} onChange={setSimulatedChurn} suffix="%" step={0.1} variant="compact" />
              </SimulatorSection>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
