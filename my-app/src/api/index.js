// src/api/index.js (or wherever)
const API = import.meta.env.VITE_API_URL;

export const getProperties = () =>
  fetch(`${API}/api/properties`).then(res => res.json());

export const postEnquiry = (body, token) =>
  fetch(`${API}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
