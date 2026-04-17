import api from "./axios";

export const getArtistProfile = async () => {
  const response = await api.get("/api/artiste/profile/");
  return response.data;
};

export const createArtistProfile = async (profileData) => {
  const config = profileData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await api.post("/api/artiste/profile/", profileData, config);
  return response.data;
};

export const updateArtistProfile = async (profileData) => {
  const config = profileData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await api.patch("/api/artiste/profile/", profileData, config);
  return response.data;
};

// Smart save — POST karke dekho, agar "already exists" aaye toh PATCH kar do
export const saveArtistProfile = async (profileData) => {
  try {
    return await createArtistProfile(profileData);
  } catch (err) {
    // Agar backend bole "profile already exists", toh PATCH se update kar do
    const msg = JSON.stringify(err?.response?.data || "").toLowerCase();
    if (err?.response?.status === 400 && msg.includes("already exists")) {
      return await updateArtistProfile(profileData);
    }
    throw err;
  }
};
