// src/components/candidate-profile/utils/validators.ts

export const isValidUrl = (url: string | null): boolean => {
  if (!url) return true; // URLs vazias são consideradas válidas (opcionais)
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};