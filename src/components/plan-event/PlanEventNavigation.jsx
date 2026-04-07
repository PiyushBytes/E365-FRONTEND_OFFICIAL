import React from "react";

export default function PlanEventNavigation({ step, totalSteps, back, next, submit }) {
  return (
    <div className="flex justify-between mt-8">
      {step > 0 ? <button onClick={back} className="px-4 py-2 border border-gray-600 rounded-lg">Back</button> : <div />}
      {step < totalSteps - 1 ? <button onClick={next} className="px-4 py-2 bg-red-600 rounded-lg">Next</button> : <button onClick={submit} className="px-4 py-2 bg-green-600 rounded-lg">Submit Plan</button>}
    </div>
  );
}
