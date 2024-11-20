import { instance } from "."; // Giả sử instance là Axios instance của bạn
const baseURL = "/bansaosach";

class BanSaoSachService {
  constructor() {}

  // Lấy tất cả bản sao sách
  async getAll(body) {
    return await instance.post(`${baseURL}/`, body); // Thay đổi phương thức gọi API từ instance.get để đảm bảo baseURL được sử dụng đúng
  }

  // Tạo mới bản sao sách
  async create(data) {
    return await instance.post(`${baseURL}/create`, data);
  }

  // Lấy bản sao sách theo ID
  async getById(id) {
    return await instance.get(`${baseURL}/${id}`);
  }

  // Cập nhật trạng thái của bản sao sách
  async update(id, data) {
    return await instance.put(`${baseURL}/update/${id}`, data);
  }

  // Xóa bản sao sách
  async delete(id) {
    return await instance.delete(`${baseURL}/delete/${id}`);
  }
}

export default new BanSaoSachService();
