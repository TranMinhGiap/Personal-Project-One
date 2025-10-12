import Cookies from 'js-cookie';

const API_SERVER = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = Cookies.get('tokenAdmin');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Hàm fetch dùng chung
const request = async (method, path, data) => {
  console.log(API_SERVER + path);
  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  };

  if (data) options.body = JSON.stringify(data);

  let response;
  try {
    response = await fetch(API_SERVER + path, options);
  } catch (fetchErr) {
    // Custom message cho network error (server down, no connection)
    if (fetchErr.name === 'TypeError' && fetchErr.message.includes('Failed to fetch')) {
      throw new Error('Server không khả dụng. Vui lòng kiểm tra kết nối mạng hoặc khởi động server.');
    }
    // Nếu lỗi khác (ví dụ: AbortError từ timeout)
    throw new Error('Lỗi kết nối không xác định. Vui lòng thử lại.');
  }

  let json;
  try {
    json = await response.json();
  } catch (err) {
    throw new Error('Backend không trả về JSON hợp lệ');
  }
  
  if (!response.ok) {
    throw new Error(json.message ||`HTTP error! Status: ${response.status}`);
  }

  return json;
};

// 🔹 Các hàm con 
export const GET = (path) => request("GET", path);
export const POST = (path, data) => request("POST", path, data);
export const PATCH = (path, data) => request("PATCH", path, data);
export const DELETE = (path) => request("DELETE", path);
