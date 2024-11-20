import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/sachyeuthich";

class SachYeuThichService {
  constructor() {}

  // Lấy danh sách sách yêu thích theo userId
  async getByUserId(userId) {
    return await instance.get(`${baseURL}/user/${userId}`);
  }

  // Lấy danh sách sách yêu thích theo ID
  async getById(id) {
    return await instance.get(`${baseURL}/${id}`);
  }

  // Cập nhật danh sách sách yêu thích theo ID
  async update(id, data) {
    return await instance.put(`${baseURL}/update/${id}`, data);
  }

  // Thêm phương thức bổ sung nếu cần, ví dụ xóa sách yêu thích (nếu có endpoint)
}

export default new SachYeuThichService();
