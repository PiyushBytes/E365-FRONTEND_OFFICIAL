import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Music2, MapPin, Languages, DollarSign, Clock, Briefcase, Camera, CheckCircle2, Loader2, Sparkles, AlertCircle, ChevronRight, UploadCloud, X, RotateCw, ZoomIn } from "lucide-react";
import Cropper from "react-easy-crop";
import { saveArtistProfile, getArtistProfile, updateArtistProfile } from "../api/artistProfile";
import { useAuth } from "../context/AuthContext";
import { secureStorage } from "../utils/secureStorage";
import { env } from "../config/env";
import getCroppedImg from "../utils/cropImage";

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
  profile_photo_url: "",
};

export default function MakeProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const isEditing = user?.is_profile_complete;
  const [isFetching, setIsFetching] = useState(isEditing || false);

  const getAvatarUrl = (url, cacheBuster) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    const baseUrl = url.startsWith('http') ? url : `${env.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    // Use stable database timestamp to bust cache cleanly without causing React re-render looping API calls
    return cacheBuster ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${cacheBuster}` : baseUrl;
  };

  const avatarCacheVal = user?.artist_profile_data?.updated_at ? new Date(user.artist_profile_data.updated_at).getTime() : '1';

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!isEditing) return;
      try {
        const data = await getArtistProfile();
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

  const processFileForCrop = (file) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result);
      setShowCropModal(true);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    });
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileForCrop(file);
      e.target.value = ''; // Reset input to allow selecting same file again
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFileForCrop(file);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const applyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels, rotation);
      if (croppedBlob) {
        const file = new File([croppedBlob], 'profile_image.jpg', { type: 'image/jpeg' });
        setFormData(prev => ({
          ...prev,
          profile_photo_file: file,
          profile_photo: URL.createObjectURL(file)
        }));
      }
      setShowCropModal(false);
    } catch (e) {
      console.error(e);
      setError("Failed to crop image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'profile_photo_file' && formData.profile_photo_file) {
          // Reverting to the safe field names that successfully processed 200 OK without 500 errors.
          payload.append('profile_photo', formData.profile_photo_file); 
          payload.append('profile_picture', formData.profile_photo_file); 
        } else if (key !== 'profile_photo' && key !== 'profile_photo_file' && key !== 'profile_photo_url' && key !== 'profile_picture') {
          let value = formData[key];
          if (["min_price", "max_price", "min_duration", "max_duration"].includes(key) && value !== "") {
            value = Number(value);
          }
          if (value !== null && value !== undefined) {
             payload.append(key, value);
          }
        }
      });

      let updatedData;
      if (isEditing) {
        updatedData = await updateArtistProfile(payload);
      } else {
        updatedData = await saveArtistProfile(payload);
      }

      localStorage.removeItem(STORAGE_KEY);
      
      const updatedUser = { ...user, is_profile_complete: true };
      
      // Crucial: Delete the entire local profile cache on save. 
      // This forces the Dashboard to independently fetch the freshest profile data directly from the server on arrival,
      // guaranteeing any newly uploaded photographs are instantly reflected instead of trusting the update payload response.
      delete updatedUser.artist_profile_data;

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

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-12 px-4 relative overflow-hidden flex items-center justify-center font-sans">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-50/50 rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-50/50 rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2 blur-3xl opacity-60" />
      
      <div className="w-full max-w-[1240px] mx-auto relative z-10">
        
        <div className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-slate-900 mb-3">
            {isEditing ? "Artist " : "Setup "} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
               {isEditing ? "Registry" : "Profile"}
            </span>
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-xl">
            {isEditing 
              ? "Manage your professional details. This catalog serves as the resume event clients evaluate." 
              : "Initialize your professional artist profile. This establishes your public presence on E365."}
          </p>
        </div>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center h-80 bg-white border border-slate-200 rounded-3xl shadow-xl">
            <Loader2 className="animate-spin mb-4 text-indigo-600" size={32} />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">Syncing Data</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Col - Identity */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
              
              <div 
                className={`bg-white border p-8 rounded-3xl flex flex-col items-center text-center shadow-lg relative overflow-hidden group transition-all duration-300 ${isDragActive ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" : "border-slate-200"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                 {(formData.profile_photo || formData.profile_photo_url) && !isDragActive && (
                    <div className="absolute inset-0 z-0 opacity-5 blur-3xl scale-110 pointer-events-none transition-all duration-700 group-hover:opacity-10">
                       <img src={getAvatarUrl(formData.profile_photo || formData.profile_photo_url, avatarCacheVal)} alt="" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="relative z-10 w-full flex flex-col items-center">
                  <div className={`relative w-48 h-48 rounded-full border-[6px] border-white bg-slate-50 shadow-xl flex items-center justify-center overflow-hidden mb-6 transition-all ${isDragActive ? "ring-4 ring-indigo-500/40" : "group-hover:ring-4 ring-indigo-500/20"}`}>
                    {(formData.profile_photo || formData.profile_photo_url) ? (
                      <img src={getAvatarUrl(formData.profile_photo || formData.profile_photo_url, avatarCacheVal)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className={`transition-colors ${isDragActive ? "text-indigo-400" : "text-slate-300"}`} size={48} />
                    )}
                    <div 
                       onClick={triggerFileInput}
                       className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white">
                       <UploadCloud size={28} className="mb-2" />
                       <span className="text-[11px] uppercase font-bold tracking-wider">Change Profile</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Display Avatar</h3>
                  <p className="text-[11px] font-medium text-slate-500 max-w-[240px] mb-6 tracking-wide">
                    {isDragActive ? <span className="text-indigo-600 font-bold">Drop your image here!</span> : "Click or drag & drop to upload a high-quality visual representation of your performance persona."}
                  </p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    name="profile_photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button type="button" onClick={triggerFileInput} className="text-xs font-bold uppercase tracking-widest text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 shadow-sm px-8 py-3 rounded-md w-full">
                    {(formData.profile_photo || formData.profile_photo_url) ? "Change Image" : "Upload Image"}
                  </button>
                 </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg flex-1 flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <User size={15}/> Professional Bio
                </label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Introduce yourself to prospective clients. Detail your expertise, accomplishments, and unique style..."
                  className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none min-h-[160px]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full hidden lg:flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.35)]"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={18} /> Processing...</>
                ) : (
                  <>{isEditing ? "Commit Changes" : "Finalize Registration"} <ChevronRight size={18} strokeWidth={3} /></>
                )}
              </button>

            </div>

            {/* Right Col - Details */}
            <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg space-y-8 flex flex-col justify-between">
              
              <div className="space-y-8">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
                      <AlertCircle size={20} className="shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                     <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <Music2 size={16} className="text-indigo-500" /> Core Attributes
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Genres</label>
                          <input type="text" name="genres" value={formData.genres} onChange={handleInputChange} placeholder="Pop, Rock, Classical..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Event Types</label>
                          <input type="text" name="event_types" value={formData.event_types} onChange={handleInputChange} placeholder="Corporate, Wedding, Concert..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                        </div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <MapPin size={16} className="text-teal-500" /> Outreach & Language
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Serviced Cities</label>
                          <input type="text" name="cities" value={formData.cities} onChange={handleInputChange} placeholder="Mumbai, Delhi, Global..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Performance Languages</label>
                          <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi, Spanish..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                            <DollarSign size={16} className="text-green-500" /> Commercial Matrix
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Min Price (₹)</label>
                              <input type="number" name="min_price" value={formData.min_price} onChange={handleInputChange} placeholder="50000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Max Price (₹)</label>
                              <input type="number" name="max_price" value={formData.max_price} onChange={handleInputChange} placeholder="250000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                            </div>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                            <Clock size={16} className="text-purple-500" /> Duration (Mins)
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Min Set</label>
                              <input type="number" name="min_duration" value={formData.min_duration} onChange={handleInputChange} placeholder="45" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Max Set</label>
                              <input type="number" name="max_duration" value={formData.max_duration} onChange={handleInputChange} placeholder="90" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium" />
                            </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <Briefcase size={16} className="text-amber-500" /> Professional Settings
                     </h4>
                     <div className="flex flex-col sm:flex-row gap-6">
                        <div className="space-y-2 flex-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Experience Level</label>
                            <select name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none">
                                <option value="">Select Category</option>
                                <option value="0-1">0-1 Years</option>
                                <option value="1-3">1-3 Years</option>
                                <option value="3-5">3-5 Years</option>
                                <option value="5-10">5-10 Years</option>
                                <option value="10+">10+ Years</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end">
                            <div className="flex w-full items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5">
                                <input type="checkbox" id="is_available" name="is_available" checked={formData.is_available} onChange={handleInputChange} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 bg-white cursor-pointer" />
                                <label htmlFor="is_available" className="text-sm text-slate-700 font-medium cursor-pointer flex-1">
                                    Accepting Bookings
                                </label>
                            </div>
                        </div>
                     </div>
                  </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full lg:hidden flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all disabled:opacity-50 mt-8 shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={18} /> Processing...</>
                ) : (
                  <>{isEditing ? "Commit Changes" : "Finalize Registration"} <ChevronRight size={18} strokeWidth={3} /></>
                )}
              </button>

            </div>
          </form>
        )}
      </div>

      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Camera size={18} className="text-indigo-600"/> Edit Profile Picture</h3>
              <button onClick={() => setShowCropModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white hover:bg-slate-200 rounded-full border border-slate-200 shadow-sm">
                <X size={18} />
              </button>
            </div>
            
            <div className="relative w-full h-[350px] bg-slate-900">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>

            <div className="p-6 bg-white space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><ZoomIn size={14} className="text-indigo-500"/> Zoom</label>
                     <span className="text-[10px] font-bold text-slate-400">{Math.round(zoom * 100)}%</span>
                   </div>
                   <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><RotateCw size={14} className="text-purple-500"/> Rotation</label>
                     <span className="text-[10px] font-bold text-slate-400">{rotation}°</span>
                   </div>
                   <input type="range" value={rotation} min={0} max={360} step={1} aria-labelledby="Rotation" onChange={(e) => setRotation(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                 </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCropModal(false)} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                  Cancel
                </button>
                <button type="button" onClick={applyCrop} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <CheckCircle2 size={16} /> Apply & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
