import axios from "axios";

const API_URL = "https://userprojectbackend-production.up.railway.app/api";

// Auth APIs
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);

// Notes APIs
export const getNotes = async (token, tag) => {
  const res = await axios.get(`${API_URL}/notes${tag ? `?tag=${tag}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // return only the notes array
  return Array.isArray(res.data.notes) ? res.data.notes : [];
};

// FIX: Make async and return res.data (the clean JSON body) instead of the full Axios response
export const createNote = async (token, data) => {
  const res = await axios.post(`${API_URL}/notes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // The backend sends { status: "success", note: { ... } }. Return the whole data object.
  return res.data;
};

export const deleteNote = (token, id) =>
  axios.delete(`${API_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
