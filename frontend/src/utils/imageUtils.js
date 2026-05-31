import { API_BASE_URL } from "../api/config";

export const fallbackImages = [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
];

export const finalFallbackImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f7f7f7"/>
      <stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0%" stop-color="#ff385c"/>
      <stop offset="100%" stop-color="#222222"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="210" y="205" width="780" height="390" rx="42" fill="#fff" opacity="0.82"/>
  <path d="M310 540 485 365l120 120 75-75 210 210H310z" fill="url(#accent)" opacity="0.9"/>
  <circle cx="785" cy="315" r="56" fill="#ff385c" opacity="0.85"/>
  <text x="600" y="670" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#222222">StayFinder</text>
</svg>
`)}`;

export function getApiBaseUrl() {
    return API_BASE_URL;
}

export function getFallbackImage(index = 0) {
    return fallbackImages[Math.abs(index) % fallbackImages.length];
}

export function getFinalFallbackImage() {
    return finalFallbackImage;
}

function getFirstValidImage(src) {
    if (Array.isArray(src)) {
        return src.find((item) => typeof item === "string" && item.trim()) || "";
    }

    return typeof src === "string" ? src : "";
}

export function getImageUrl(src, fallbackIndex = 0) {
    const value = getFirstValidImage(src).trim();

    if (!value) {
        return getFallbackImage(fallbackIndex);
    }

    if (/^(https?:|data:|blob:)/i.test(value)) {
        return value;
    }

    const apiBaseUrl = getApiBaseUrl();

    if (value.startsWith("/api/upload-image/") || value.startsWith("/uploads/")) {
        return `${apiBaseUrl}${value}`;
    }

    if (value.startsWith("api/upload-image/")) {
        return `${apiBaseUrl}/${value}`;
    }

    if (value.startsWith("uploads/")) {
        return `${apiBaseUrl}/${value}`;
    }

    return `${apiBaseUrl}/api/upload-image/${value.replace(/^\/+/, "")}`;
}

export function resolveImageUrl(src, fallbackIndex = 0) {
    return getImageUrl(src, fallbackIndex);
}

export function getImageGallery(photos = [], minCount = 5) {
    const validPhotos = Array.isArray(photos)
        ? photos.filter((photo) => typeof photo === "string" && photo.trim())
        : [getFirstValidImage(photos)].filter(Boolean);
    const gallery = [...validPhotos];

    while (gallery.length < minCount) {
        gallery.push(getFallbackImage(gallery.length));
    }

    return gallery;
}
