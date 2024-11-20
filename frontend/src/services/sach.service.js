import { instance } from ".";
const baseURL = "/sach";

class SachService {
  constructor() {}

  async getAll(body) {
    // Thay đổi phương thức gọi API từ instance.get để đảm bảo baseURL được sử dụng đúng
    return await instance.post(`${baseURL}/`, body);
  }

  async create(data) {
    return await instance.post(`${baseURL}/create`, data);
  }

  async getCopies(id) {
    return await instance.get(`${baseURL}/bansaosach/${id}`);
  }

  async getById(id) {
    return await instance.get(`${baseURL}/${id}`);
  }

  async update(id, data) {
    console.log("update");
    console.log(id);
    console.log(data);
    return await instance.put(`${baseURL}/${id}`, data);
  }

  async delete(id) {
    return await instance.delete(`${baseURL}/${id}`);
  }
}

export default new SachService();
