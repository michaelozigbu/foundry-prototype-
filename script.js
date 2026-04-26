const SUPABASE_URL = "https://jbxjrxzjfzhuhblanwpv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_uUukNT0DSrBfgYaOi6ds0A_501NJMxg";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const financeForm = document.getElementById("financeForm");
const waitlistForm = document.getElementById("waitlistForm");
const emailInput = document.getElementById("email");
const waitlistSubmitButton = waitlistForm.querySelector('button[type="submit"]');
const defaultWaitlistButtonText = waitlistSubmitButton.textContent;
const accessModal = document.getElementById("accessModal");
const modalEmail = document.getElementById("modalEmail");
const closeModalButton = document.getElementById("closeModal");
const modalActionButton = document.getElementById("modalAction");
const fields = {
  mrr: document.getElementById("mrr"),
  expenses: document.getElementById("expenses"),
  cash: document.getElementById("cash"),
  churn: document.getElementById("churn"),
  growth: document.getElementById("growth"),
};

const outputs = {
  mrrValue: document.getElementById("mrrValue"),
  expenseValue: document.getElementById("expenseValue"),
  cashValue: document.getElementById("cashValue"),
  churnValue: document.getElementById("churnValue"),
  growthValue: document.getElementById("growthValue"),
  runwayMonths: document.getElementById("runwayMonths"),
  runwayTone: document.getElementById("runwayTone"),
  salaryResult: document.getElementById("salaryResult"),
  hireResult: document.getElementById("hireResult"),
  netResult: document.getElementById("netResult"),
  riskResult: document.getElementById("riskResult"),
  decisionNote: document.getElementById("decisionNote"),
  heroRunway: document.getElementById("heroRunway"),
};

function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function getRiskLabel(runwayMonths, netCash) {
  if (runwayMonths < 6 || netCash < -1500) return "Tight";
  if (runwayMonths < 12 || netCash < 0) return "Watch closely";
  if (runwayMonths < 18) return "Measured";
  return "Comfortable";
}

function getHireWindow(runwayMonths, growthRate, netCash) {
  if (runwayMonths < 9 || netCash < 500) return "Not yet";
  if (growthRate >= 8 && runwayMonths >= 18) return "Now looks viable";
  if (growthRate >= 5 && runwayMonths >= 14) return "In 2-4 months";
  return "After more proof";
}

function getTone(runwayMonths) {
  if (runwayMonths < 6) return "Burn is outrunning your cushion. Protect cash now.";
  if (runwayMonths < 12) return "You still have options, but this is not coast mode.";
  if (runwayMonths < 18) return "Healthy cushion with room to experiment.";
  return "Strong position. You can plan moves instead of reacting to them.";
}

function getDecisionNote(runwayMonths, salary, hireWindow, churnRate) {
  if (runwayMonths < 6) {
    return "Pause new commitments and focus on extending cash. A founder pay increase or hire would add pressure quickly.";
  }

  if (hireWindow === "Now looks viable" && churnRate < 3) {
    return "The model suggests you can pay yourself and seriously consider a hire, assuming churn stays disciplined.";
  }

  if (salary < 1500) {
    return "You can probably pay yourself something small, but the bigger win is keeping burn contained until revenue compounds.";
  }

  return "You can likely pay yourself modestly now, but a hire should wait until growth proves durable for a few months.";
}

function calculate() {
  const mrr = Number(fields.mrr.value);
  const expenses = Number(fields.expenses.value);
  const cash = Number(fields.cash.value);
  const churnRate = Number(fields.churn.value) / 100;
  const growthRate = Number(fields.growth.value) / 100;

  const netCash = mrr * (1 + growthRate - churnRate) - expenses;
  const monthlyBurn = Math.max(expenses - mrr * (1 - churnRate + growthRate), 250);
  const runwayMonths = cash / monthlyBurn;
  const safeSalary = Math.max(0, Math.round((netCash * 0.45) / 50) * 50);
  const hireWindow = getHireWindow(runwayMonths, growthRate * 100, netCash);
  const riskLabel = getRiskLabel(runwayMonths, netCash);

  outputs.mrrValue.textContent = formatter.format(mrr);
  outputs.expenseValue.textContent = formatter.format(expenses);
  outputs.cashValue.textContent = formatter.format(cash);
  outputs.churnValue.textContent = formatPercent(fields.churn.value);
  outputs.growthValue.textContent = formatPercent(fields.growth.value);

  outputs.runwayMonths.textContent = `${runwayMonths.toFixed(1)} months`;
  outputs.heroRunway.textContent = `${Math.max(4.5, runwayMonths + 0.6).toFixed(1)} months`;
  outputs.runwayTone.textContent = getTone(runwayMonths);
  outputs.salaryResult.textContent = formatter.format(safeSalary);
  outputs.hireResult.textContent = hireWindow;
  outputs.netResult.textContent = `${netCash >= 0 ? "+" : "-"}${formatter.format(Math.abs(netCash))}`;
  outputs.riskResult.textContent = riskLabel;
  outputs.decisionNote.textContent = getDecisionNote(
    runwayMonths,
    safeSalary,
    hireWindow,
    churnRate * 100
  );
}

function openModal(email) {
  modalEmail.textContent = email;
  accessModal.hidden = false;
  document.body.style.overflow = "hidden";
  closeModalButton.focus();
}

function closeModal() {
  accessModal.hidden = true;
  document.body.style.overflow = "";
  emailInput.focus();
}

financeForm.addEventListener("input", calculate);

waitlistForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  const email = emailInput.value.trim().toLowerCase();

  waitlistSubmitButton.disabled = true;
  waitlistSubmitButton.textContent = "Requesting...";

  const { error } = await supabaseClient.from("waitlist_signups").insert([
    {
      email,
      source: "landing-page",
      consent: true,
    },
  ]);

  waitlistSubmitButton.disabled = false;
  waitlistSubmitButton.textContent = defaultWaitlistButtonText;

  if (error) {
    if (error.code === "23505") {
      openModal(email);
      waitlistForm.reset();
      return;
    }

    window.alert("Something went wrong while saving your email. Please try again.");
    return;
  }

  openModal(email);
  waitlistForm.reset();
});

closeModalButton.addEventListener("click", closeModal);
modalActionButton.addEventListener("click", closeModal);

accessModal.addEventListener("click", (event) => {
  if (event.target === accessModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !accessModal.hidden) {
    closeModal();
  }
});

calculate();
