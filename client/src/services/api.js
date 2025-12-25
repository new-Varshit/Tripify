const BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include", // ⭐ REQUIRED
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  return res;
};
