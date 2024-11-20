import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/user";

class UserService {
  constructor() {}

  async getUsers(body) {
    return await instance.post(`${baseURL}/get-users`, body);
  }

  async getUserById(userId) {
    return await instance.get(`${baseURL}/${userId}`);
  }

  async createUser(user) {
    return await instance.post(`${baseURL}`, user);
  }

  async updateUser(user) {
    return await instance.put(`${baseURL}/update/${user._id}`, user);
  }

  async deleteUser(userId) {
    return await instance.put(`${baseURL}/delete/${userId}`);
  }

  async changeActiveStatus(user) {
    return await instance.put(`${baseURL}/update-status/${user._id}`, user);
  }
}

export default new UserService();
