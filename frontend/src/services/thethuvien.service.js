import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/thethuvien";

class TheThuVienService {
  constructor() {}

  // Lấy thông tin thẻ thư viện theo userId
  async getByUserId(userId) {
    return await instance.get(`${baseURL}/${userId}`);
  }

  // Tạo thẻ thư viện mới
  async create(data) {
    return await instance.post(`${baseURL}/`, data);
  }

  // Gia hạn thẻ thư viện
  async renew(data) {
    return await instance.put(`${baseURL}/renew`, data);
  }

  // Khóa thẻ thư viện
  async block(data) {
    return await instance.put(`${baseURL}/block`, data);
  }
}

export default new TheThuVienService();
