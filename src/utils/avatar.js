import { env } from "../config/env";

export const getAvatarUrl = (url, cacheBuster) => {
  if (!url) return null;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  const baseUrl = url.startsWith('http') ? url : `${env.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  return cacheBuster ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${cacheBuster}` : baseUrl;
};

export const getUserAvatarSrc = (user) => {
  if (!user) return null;
  return user?.artist_profile_data?.profile_photo || 
         user?.artist_profile_data?.profile_photo_url || 
         user?.profile_photo || 
         user?.profile_picture || 
         user?.profilePicture || 
         null;
};

export const getUserAvatarCacheVal = (user) => {
  if (!user) return '1';
  return user?.artist_profile_data?.updated_at ? new Date(user.artist_profile_data.updated_at).getTime() : '1';
};
