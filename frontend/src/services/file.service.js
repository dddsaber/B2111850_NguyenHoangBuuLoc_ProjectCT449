import { imgInstance } from "."; // Đảm bảo đường dẫn này đúng
import { baseURL } from "../utils/constants";

class FileUploadService {
  constructor() {}

  async uploadFileUser(file) {
    const formData = new FormData(); // Tạo FormData
    formData.append("user", file); // Thêm file vào FormData

    const response = await imgInstance.post(
      `${baseURL}/upload/user`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo đúng header
        },
      }
    );
    return response;
  }

  async uploadFileBook(file) {
    const formData = new FormData(); // Tạo FormData
    formData.append("book", file); // Thêm file vào FormData

    const response = await imgInstance.post(
      `${baseURL}/upload/book`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo đúng header
        },
      }
    );
    return response;
  }

  async uploadFilesBook(files) {
    const formData = new FormData(); // Tạo FormData
    files.forEach((file) => {
      formData.append("books", file); // Thêm file vào FormData
    });

    const response = await imgInstance.post(
      `${baseURL}/upload/books`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo đúng header
        },
      }
    );
    return response;
  }
}

export default new FileUploadService();
