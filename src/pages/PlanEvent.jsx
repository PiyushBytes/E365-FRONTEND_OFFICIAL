import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Event Type",
  "Event Basics",
  "Event Scale",
  "Services",
  "Budget",
  "Timeline",
  "Contact Info",
];

export default function PlanEvent() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventType: "",
    date: "",
    city: "",
    venueType: "",
    audienceSize: 100,
    duration: "",
    services: [],
    budget: "",
    proposalDeadline: "",
    decisionMaker: "",
    name: "",
    phone: "",
    email: "",
  });

  const update = (field, value) => setFormData({ ...formData, [field]: value });
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div
      onClick={() => navigate("/")}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center px-6 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-black/70 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.2)]"
      >
        <h2 className="text-xl font-bold text-red-500 mb-6 text-center">
          {steps[step]}
        </h2>

        {/* STEP CONTENT */}
        <div
          key={step}
          className="min-h-200px flex flex-col gap-4 animate-fade"
        >
          {step === 0 && (
            <>
              {["Corporate", "Wedding", "Concert", "College Fest", "Exhibition", "Private Party"].map((type) => (
                <button
                  key={type}
                  onClick={() => update("eventType", type)}
                  className={`p-3 rounded-lg border ${
                    formData.eventType === type
                      ? "border-red-500 bg-red-600/20"
                      : "border-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <input type="date" onChange={(e) => update("date", e.target.value)} className="input-style" />
              <input type="text" placeholder="City" onChange={(e) => update("city", e.target.value)} className="input-style" />
              <div className="flex gap-4">
                {["Indoor", "Outdoor"].map((v) => (
                  <button
                    key={v}
                    onClick={() => update("venueType", v)}
                    className={`flex-1 p-2 rounded-lg border ${
                      formData.venueType === v ? "border-red-500 bg-red-600/20" : "border-gray-700"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label>Audience Size: {formData.audienceSize}</label>
              <input
                type="range"
                min="50"
                max="10000"
                value={formData.audienceSize}
                onChange={(e) => update("audienceSize", e.target.value)}
              />
              <input type="text" placeholder="Event Duration" onChange={(e) => update("duration", e.target.value)} className="input-style" />
            </>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {["Stage", "Sound", "Lighting", "LED", "Artists", "Streaming", "Security", "Branding"].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    update(
                      "services",
                      formData.services.includes(s)
                        ? formData.services.filter((x) => x !== s)
                        : [...formData.services, s]
                    )
                  }
                  className={`p-3 rounded-lg border ${
                    formData.services.includes(s)
                      ? "border-red-500 bg-red-600/20"
                      : "border-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <>
              {["Budget Friendly", "Standard", "Premium Experience"].map((b) => (
                <button
                  key={b}
                  onClick={() => update("budget", b)}
                  className={`p-3 rounded-lg border ${
                    formData.budget === b
                      ? "border-red-500 bg-red-600/20"
                      : "border-gray-700"
                  }`}
                >
                  {b}
                </button>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              <input type="text" placeholder="Proposal Needed By" onChange={(e) => update("proposalDeadline", e.target.value)} className="input-style" />
              <div className="flex gap-4">
                {["Yes", "No"].map((d) => (
                  <button
                    key={d}
                    onClick={() => update("decisionMaker", d)}
                    className={`flex-1 p-2 rounded-lg border ${
                      formData.decisionMaker === d ? "border-red-500 bg-red-600/20" : "border-gray-700"
                    }`}
                  >
                    Final Decision Maker: {d}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <input type="text" placeholder="Your Name" onChange={(e) => update("name", e.target.value)} className="input-style" />
              <input type="tel" placeholder="Phone Number" onChange={(e) => update("phone", e.target.value)} className="input-style" />
              <input type="email" placeholder="Email Address" onChange={(e) => update("email", e.target.value)} className="input-style" />
            </>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button onClick={back} className="px-4 py-2 border border-gray-600 rounded-lg">
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} className="px-4 py-2 bg-red-600 rounded-lg">
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                console.log(formData);
                alert("Event Plan Submitted (Demo) 🎉");
                navigate("/");
              }}
              className="px-4 py-2 bg-green-600 rounded-lg"
            >
              Submit Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
