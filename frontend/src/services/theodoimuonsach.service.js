import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/theodoimuonsach";

class TheoDoiMuonSachService {
  constructor() {}

  // Tạo mới một bản ghi theo dõi mượn sách
  async create(data) {
    return await instance.post(`${baseURL}/create`, data);
  }

  async createOnline(data) {
    return await instance.post(`${baseURL}/create-online`, data);
  }

  // Xóa bản ghi theo dõi mượn sách theo ID
  async delete(id) {
    return await instance.delete(`${baseURL}/delete/${id}`);
  }

  // Lấy tất cả bản ghi theo dõi mượn sách
  async getAll(data) {
    return await instance.post(`${baseURL}/`, data);
  }

  // Lấy thông tin bản ghi theo dõi mượn sách theo ID
  async getById(id) {
    return await instance.get(`${baseURL}/${id}`);
  }
  async getByUserId(id) {
    return await instance.get(`${baseURL}/user/${id}`);
  }

  // Tìm kiếm bản ghi theo dõi mượn sách theo tham chiếu
  async getByRefId(refId) {
    return await instance.get(`${baseURL}/search`, { params: { refId } });
  }

  // Cập nhật bản ghi theo dõi mượn sách theo ID
  async update(id, data) {
    return await instance.put(`${baseURL}/update/${id}`, data);
  }

  // Cập nhật trạng thái của bản ghi theo dõi mượn sách theo ID
  async updateTrangThai(id, data) {
    return await instance.put(`${baseURL}/update-trang-thai/${id}`, data);
  }
}

export default new TheoDoiMuonSachService();
