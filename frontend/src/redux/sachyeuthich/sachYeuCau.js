import { notification } from "ant-design-vue";

// store/modules/sachYeuCau.js
export default {
  namespaced: true,
  state: {
    sachYeuCau: [], // Đảm bảo khởi tạo là mảng rỗng
  },
  getters: {
    getSachYeuCau(state) {
      return state.sachYeuCau || []; // Trả về mảng rỗng nếu undefined
    },
  },
  mutations: {
    addSachYeuCau(state, bookId) {
      if (!state.sachYeuCau.includes(bookId)) {
        state.sachYeuCau.push(bookId);
        notification.success({
          message: "Thêm sách thành công",
          description: "Sách đã được thêm vào danh sách sách yêu cầu.",
        });
      } else {
        notification.warning({
          message: "Trùng lặp",
          description: "Bạn đã chọn sách này rồi.",
        });
      }
      console.log("state: ", state.sachYeuCau);
    },
    removeSachYeuCau(state, bookId) {
      state.sachYeuCau = state.sachYeuCau.filter((id) => id !== bookId);
    },
    resetSachYeuCau(state) {
      state.sachYeuCau = [];
    },
  },
  actions: {
    addSachYeuCau({ commit }, bookId) {
      commit("addSachYeuCau", bookId);
    },
    removeSachYeuCau({ commit }, bookId) {
      commit("removeSachYeuCau", bookId);
    },
    resetSachYeuCau({ commit }) {
      commit("resetSachYeuCau");
    },
  },
};
