import { instance } from "."; // Đảm bảo đường dẫn này đúng
const baseURL = "/mail";

class MailService {
  constructor() {}

  async sendmail(body) {
    return await instance.post(`${baseURL}/`, body);
  }
}

export default new MailService();
