// src/components/candidate-profile/utils/formatters.ts

export const formatSocialMediaUrl = (url: string | undefined, domain: string): string | null => {
  if (!url || url.trim() === "") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("www.")) return `https://${url}`;
  if (url.includes(domain)) return `https://${url}`;
  return `https://www.${domain}/${url.replace(/^\/+/, "")}`;
};