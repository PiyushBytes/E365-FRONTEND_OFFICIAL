import React from "react";
import { usePlanEventForm } from "../hooks/usePlanEventForm";
import PlanEventFields from "../components/plan-event/PlanEventFields";
import PlanEventNavigation from "../components/plan-event/PlanEventNavigation";

const STEPS = ["Event Type", "Event Basics", "Event Scale", "Services", "Budget", "Timeline", "Contact Info"];

export default function PlanEvent() {
  const { step, formData, update, next, back, submit, cancel } = usePlanEventForm();
  return (
    <div onClick={cancel} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center px-6 z-50">
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl bg-black/70 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.2)]">
        <h2 className="text-xl font-bold text-red-500 mb-6 text-center">{STEPS[step]}</h2>
        <PlanEventFields step={step} formData={formData} update={update} />
        <PlanEventNavigation step={step} totalSteps={STEPS.length} back={back} next={next} submit={submit} />
      </div>
    </div>
  );
}
