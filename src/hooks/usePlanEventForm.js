// Yeh hook Plan Event ke form steps ko handle karta hai (Next, Back, Submit)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function usePlanEventForm() {
  const [step, setStep] = useState(0); // Kaun se step par hai (0 se start)
  const navigate = useNavigate();
  
  // Pooora form data state ke andar maintain hoga
  const [formData, setFormData] = useState({ eventType: "", date: "", city: "", venueType: "", audienceSize: 100, duration: "", services: [], budget: "", proposalDeadline: "", decisionMaker: "", name: "", phone: "", email: "" });

  // Function: Kisi bhi ek form field ko update karne ke liye
  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  // Navigation functions: agle step me jao ya peeche aao
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  
  // Submit block: Finalize hone ke baad API / console logs
  const submit = () => { console.log(formData); alert("Event Plan Submitted 🎉"); navigate("/"); };
  
  // Modal cut karna
  const cancel = () => navigate("/");

  // UI ko expose karo return ke threw
  return { step, formData, update, next, back, submit, cancel };
}
