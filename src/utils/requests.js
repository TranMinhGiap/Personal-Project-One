import Cookies from 'js-cookie';

const API_SERVER = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = Cookies.get('tokenAdmin');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (method, path, data) => {
  let url = API_SERVER + path;

  // Nếu là GET => build query string
  if (method === 'GET' && data && typeof data === 'object') {
    const filteredParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const params = new URLSearchParams(filteredParams).toString();
    if (params) url += (url.includes('?') ? '&' : '?') + params;
  }

  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  };

  // Nếu không phải GET => thêm body
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Server không khả dụng. Kiểm tra lại kết nối hoặc khởi động server.');
    }
    throw new Error('Lỗi kết nối không xác định.'); 
  }

  let json;
  try {
    json = await response.json();
  } catch {
    throw new Error('Backend không trả về JSON hợp lệ');
  }

  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return json;
};

// 🔹 Các hàm tiện dụng
export const GET = (path, params) => request('GET', path, params);
export const POST = (path, data) => request('POST', path, data);
export const PATCH = (path, data) => request('PATCH', path, data);
export const DELETE = (path, data) => request('DELETE', path, data);
