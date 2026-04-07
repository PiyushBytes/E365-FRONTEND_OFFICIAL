import React from "react";

export default function PlanEventFields({ step, formData, update }) {
  return (
    <div className="min-h-200px flex flex-col gap-4 animate-fade">
      {step === 0 && ["Corporate", "Wedding", "Concert", "College Fest", "Exhibition", "Private Party"].map(t => <button key={t} onClick={() => update("eventType", t)} className={`p-3 rounded-lg border ${formData.eventType === t ? "border-red-500 bg-red-600/20" : "border-gray-700"}`}>{t}</button>)}
      {step === 1 && <><input type="date" onChange={e => update("date", e.target.value)} className="input-style" /><input type="text" placeholder="City" onChange={e => update("city", e.target.value)} className="input-style" /><div className="flex gap-4">{["Indoor", "Outdoor"].map(v => <button key={v} onClick={() => update("venueType", v)} className={`flex-1 p-2 rounded-lg border ${formData.venueType === v ? "border-red-500 bg-red-600/20" : "border-gray-700"}`}>{v}</button>)}</div></>}
      {step === 2 && <><label>Audience Size: {formData.audienceSize}</label><input type="range" min="50" max="10000" value={formData.audienceSize} onChange={e => update("audienceSize", e.target.value)} /><input type="text" placeholder="Event Duration" onChange={e => update("duration", e.target.value)} className="input-style" /></>}
      {step === 3 && <div className="grid grid-cols-2 gap-3">{["Stage", "Sound", "Lighting", "LED", "Artists", "Streaming", "Security", "Branding"].map(s => <button key={s} onClick={() => update("services", formData.services.includes(s) ? formData.services.filter(x => x !== s) : [...formData.services, s])} className={`p-3 rounded-lg border ${formData.services.includes(s) ? "border-red-500 bg-red-600/20" : "border-gray-700"}`}>{s}</button>)}</div>}
      {step === 4 && ["Budget Friendly", "Standard", "Premium Experience"].map(b => <button key={b} onClick={() => update("budget", b)} className={`p-3 rounded-lg border ${formData.budget === b ? "border-red-500 bg-red-600/20" : "border-gray-700"}`}>{b}</button>)}
      {step === 5 && <><input type="text" placeholder="Proposal Needed By" onChange={e => update("proposalDeadline", e.target.value)} className="input-style" /><div className="flex gap-4">{["Yes", "No"].map(d => <button key={d} onClick={() => update("decisionMaker", d)} className={`flex-1 p-2 rounded-lg border ${formData.decisionMaker === d ? "border-red-500 bg-red-600/20" : "border-gray-700"}`}>Final Decision Maker: {d}</button>)}</div></>}
      {step === 6 && <><input type="text" placeholder="Your Name" onChange={e => update("name", e.target.value)} className="input-style" /><input type="tel" placeholder="Phone Number" onChange={e => update("phone", e.target.value)} className="input-style" /><input type="email" placeholder="Email Address" onChange={e => update("email", e.target.value)} className="input-style" /></>}
    </div>
  );
}
