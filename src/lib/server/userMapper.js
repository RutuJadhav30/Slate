/**
 * User mapper utilities for transforming Supabase user data
 * to application-specific user objects
 */

// Available avatar color palette
const avatarPalette = ["rose", "amber", "emerald", "sky", "violet", "pink"];

// Default user preferences
const defaultUserPreferences = {
  weeklySummary: true,
  productUpdates: false,
};

/**
 * Ensures avatar color is valid, fallback to first color if invalid
 * @param {string} color - Avatar color to validate
 * @returns {string} Valid avatar color
 */
const safeAvatarColor = (color) =>
  avatarPalette.includes(color) ? color : avatarPalette[0];

/**
 * Ensures user preferences have all required fields with defaults
 * @param {Object} preferences - User preferences object
 * @returns {Object} Complete preferences object
 */
const ensurePreferences = (preferences) => ({
  weeklySummary:
    typeof preferences?.weeklySummary === "boolean"
      ? preferences.weeklySummary
      : defaultUserPreferences.weeklySummary,
  productUpdates:
    typeof preferences?.productUpdates === "boolean"
      ? preferences.productUpdates
      : defaultUserPreferences.productUpdates,
});

/**
 * Maps Supabase user object to application user object
 * @param {Object} user - Supabase user object
 * @returns {Object|null} Mapped user object or null
 */
export const mapSupabaseUser = (user) => {
  if (!user) return null;
  const metadata = user.user_metadata ?? {};
  const preferences = ensurePreferences(metadata.preferences);

  return {
    id: user.id,
    email: user.email ?? "",
    name: metadata.name ?? user.email?.split("@")[0] ?? "Queue member",
    avatarColor: safeAvatarColor(metadata.avatarColor ?? "sky"),
    title: metadata.title ?? "",
    timezone: metadata.timezone ?? "UTC",
    bio: metadata.bio ?? "",
    preferences,
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? user.created_at,
  };
};

/**
 * Builds profile metadata object for Supabase user update
 * @param {Object} data - Profile data from form
 * @returns {Object} Metadata object for Supabase
 */
export const buildProfileMetadata = (data) => ({
  name: data.name,
  title: data.title ?? "",
  timezone: data.timezone ?? "UTC",
  bio: data.bio ?? "",
  avatarColor: safeAvatarColor(data.avatarColor ?? "sky"),
  preferences: ensurePreferences(data.preferences),
});

/**
 * Returns a copy of default user preferences
 * @returns {Object} Default preferences object
 */
export const getDefaultPreferences = () => ({ ...defaultUserPreferences });

/**
 * Returns a random avatar color from the palette
 * Used for assigning default avatar colors to new users
 * @returns {string} Random avatar color
 */
export const getRandomAvatarColor = () =>
  avatarPalette[Math.floor(Math.random() * avatarPalette.length)] ??
  avatarPalette[0];
