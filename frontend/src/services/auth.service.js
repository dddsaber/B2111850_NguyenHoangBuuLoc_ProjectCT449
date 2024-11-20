import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/auth";

class AuthService {
  constructor() {}

  async register(body) {
    return await instance.post(`${baseURL}/register`, body);
  }

  async login(body) {
    return await instance.post(`${baseURL}/login`, body);
  }

  async logout(id) {
    return await instance.get(`${baseURL}/logout/${id}`);
  }

  async reAuth(body) {
    return await instance.post(`${baseURL}/reauth`, body);
  }

  async changePassword(body) {
    return await instance.post(`${baseURL}/change-password`, body);
  }

  async forgotPassword(body) {
    return await instance.post(`${baseURL}/forgot-password`, body);
  }

  async resetPassword(body) {
    return await instance.post(`${baseURL}/change-password-on-confirm`, body);
  }
}

export default new AuthService();
