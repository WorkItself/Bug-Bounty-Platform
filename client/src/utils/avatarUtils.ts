// Default avatar URLs
// Guest users get a generic default avatar (like Facebook's)
// Logged-in users without profile pictures get a different default

export const DEFAULT_AVATAR_GUEST = 'https://ui-avatars.com/api/?name=Guest&background=6b7280&color=ffffff&size=150';

export const getDefaultAvatarUrl = (isLoggedIn: boolean, name?: string | null): string => {
  if (!isLoggedIn) {
    // Guest user - generic default
    return DEFAULT_AVATAR_GUEST;
  }
  
  // Logged-in user - use their name initial as default
  if (name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=ffffff&size=150`;
  }
  
  return DEFAULT_AVATAR_GUEST;
};

export const getAvatarUrl = (avatarUrl?: string | null, isLoggedIn?: boolean, name?: string | null): string => {
  if (avatarUrl) {
    return avatarUrl;
  }
  
  return getDefaultAvatarUrl(isLoggedIn || false, name);
};
