import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Music2, MapPin, Ticket, Languages, DollarSign, Clock, Briefcase, Camera, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { saveArtistProfile, getArtistProfile, updateArtistProfile } from "../api/artistProfile";
import { useAuth } from "../context/AuthContext";
import { secureStorage } from "../utils/secureStorage";

const STORAGE_KEY = "e365_artist_profile_draft";

const defaultFormData = {
  bio: "",
  genres: "",
  cities: "",
  event_types: "",
  languages: "",
  min_price: "",
  max_price: "",
  experience: "",
  min_duration: "",
  max_duration: "",
  is_available: true,
  profile_photo: "",
};

export default function MakeProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  
  // LocalStorage se saved draft load karo agar available hai
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  // Jab bhi formData change ho, localStorage mein save kar do
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const isEditing = user?.is_profile_complete;
  const [isFetching, setIsFetching] = useState(isEditing || false);

  // Fetch the existing profile if we are in Edit mode
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!isEditing) return;
      try {
        const data = await getArtistProfile();
        // Convert arrays to comma separated strings if needed by backend design
        const formattedData = { ...defaultFormData, ...data.profile ? data.profile : data };
        ["genres", "cities", "event_types", "languages"].forEach(key => {
          if (Array.isArray(formattedData[key])) {
            formattedData[key] = formattedData[key].join(", ");
          }
        });
        setFormData(formattedData);
      } catch (err) {
        console.error("Failed to fetch existing profile:", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchExistingProfile();
  }, [isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Direct JSON payload as per user's state
      let payload = { ...formData };
      
      // Ensure numeric fields are cast if not empty, otherwise keep empty string
      ["min_price", "max_price", "min_duration", "max_duration"].forEach(key => {
        if (payload[key] !== "") {
          payload[key] = Number(payload[key]);
        }
      });

      if (isEditing) {
        // Correctly use PATCH endpoint if the profile exists
        await updateArtistProfile(payload);
      } else {
        // Smart save using POST for new profiles
        await saveArtistProfile(payload);
      }

      localStorage.removeItem(STORAGE_KEY);
      
      // Profile ban gaya — ab user ko is_profile_complete = true mark kar do
      const updatedUser = { ...user, is_profile_complete: true };
      setUser(updatedUser);
      secureStorage.setItem("user", updatedUser);
      
      navigate("/artist");
    } catch (err) {
      console.error("Profile creation error:", err);
      
      const resData = err?.response?.data;
      if (resData && typeof resData === 'object') {
        const errorMessages = Object.entries(resData).map(([key, msgs]) => {
          const msgStr = Array.isArray(msgs) ? msgs.join(', ') : msgs;
          return key === 'detail' || key === 'error' ? msgStr : `${key.replace('_', ' ').toUpperCase()}: ${msgStr}`;
        });
        setError(errorMessages.join(" | ") || "Failed to create profile. Please check the inputs.");
      } else {
        setError(err?.message || "Failed to create profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
            <Sparkles className="text-red-500" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
            {isEditing ? "Update Your " : "Create Your "} 
            <span className="text-red-600 italic">Identity</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-wide max-w-xl mx-auto">
            {isEditing ? "Modify your profile settings so event producers have the most accurate information." : "Set up your professional artist profile. This is what top event producers and clients will see."}
          </p>
        </div>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-bold tracking-widest uppercase">Loading Profile Data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-8 md:p-10 space-y-10">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Profile Photo Section (URL) */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-800/50">
              <div className="group relative w-24 h-24 rounded-2xl bg-[#111111] border border-gray-800 flex items-center justify-center overflow-hidden">
                {formData.profile_photo ? (
                  <img src={formData.profile_photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-600" size={32} />
                )}
              </div>
              <div className="flex-1 w-full space-y-3">
                <h3 className="text-xl font-bold">Profile Picture URL</h3>
                <p className="text-sm text-gray-500">
                  Provide a link to your high-quality professional headshot or performance photo.
                </p>
                <input 
                  type="url" 
                  name="profile_photo"
                  value={formData.profile_photo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14}/> Bio / Summary
                </label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell clients about your artistry, journey, and what makes your performance unique..."
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Music2 size={14}/> Genres
                </label>
                <input 
                  type="text" 
                  name="genres"
                  value={formData.genres}
                  onChange={handleInputChange}
                  placeholder="e.g. Pop, Rock, Classical (comma separated)"
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14}/> Cities Available
                </label>
                <input 
                  type="text" 
                  name="cities"
                  value={formData.cities}
                  onChange={handleInputChange}
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Ticket size={14}/> Event Types
                </label>
                <input 
                  type="text" 
                  name="event_types"
                  value={formData.event_types}
                  onChange={handleInputChange}
                  placeholder="e.g. Wedding, Corporate, Concert"
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Languages size={14}/> Languages
                </label>
                <input 
                  type="text" 
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="e.g. English, Hindi, Punjabi"
                  className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Pricing */}
              <div className="space-y-2 md:col-span-2 mt-2">
                <h4 className="text-sm font-semibold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-red-500" /> Pricing Matrix (₹)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Minimum Price</label>
                    <input 
                      type="number" 
                      name="min_price"
                      value={formData.min_price}
                      onChange={handleInputChange}
                      placeholder="25000"
                      className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Maximum Price</label>
                    <input 
                      type="number" 
                      name="max_price"
                      value={formData.max_price}
                      onChange={handleInputChange}
                      placeholder="50000"
                      className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Settings */}
              <div className="space-y-2 mt-2">
                <h4 className="text-sm font-semibold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-red-500" /> Duration (Mins)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Min Length</label>
                    <input 
                      type="number" 
                      name="min_duration"
                      value={formData.min_duration}
                      onChange={handleInputChange}
                      placeholder="40"
                      className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Max Length</label>
                    <input 
                      type="number" 
                      name="max_duration"
                      value={formData.max_duration}
                      onChange={handleInputChange}
                      placeholder="60"
                      className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="space-y-4 mt-2">
                <h4 className="text-sm font-semibold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-red-500" /> Experience & Status
                </h4>
                
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Years of Experience</label>
                  <select 
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full bg-[#111111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all appearance-none"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="0-1">0-1 Years</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="is_available"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-800 text-red-600 focus:ring-red-500 focus:ring-offset-gray-900 bg-[#111111] cursor-pointer"
                  />
                  <label htmlFor="is_available" className="text-sm text-gray-300 font-medium cursor-pointer flex-1">
                    I am currently available to take bookings
                  </label>
                </div>

              </div>

            </div>
          </div>

          {/* Footer / Submit */}
          <div className="bg-[#111111] border-t border-gray-800 p-6 flex items-center justify-between">
            <p className="text-xs text-gray-500 hidden md:block">
              All fields are required to {isEditing ? "update" : "unlock"} your dashboard.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_30px_rgba(255,0,60,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {isEditing ? "Save Changes" : "Publish Profile & Enter Dashboard"}
                </>
              )}
            </button>
          </div>
        </form>
        )}

      </div>
    </div>
  );
}
