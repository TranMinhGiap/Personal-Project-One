import Cookies from 'js-cookie';

const API_SERVER = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = Cookies.get('tokenUser');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Hàm fetch dùng chung
const request = async (method, path, data) => {
  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(API_SERVER + path, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

// 🔹 Các hàm con 
export const GET = (path) => request("GET", path);
export const POST = (path, data) => request("POST", path, data);
export const PATCH = (path, data) => request("PATCH", path, data);
export const DELETE = (path) => request("DELETE", path);
