const state = {
  sachYeuCau: [], // Danh sách chứa id của sách
};

const getters = {
  // Lấy danh sách `sachYeuCau`
  getSachYeuCau: (state) => state.sachYeuCau,
};

const actions = {
  // Thêm một sách vào danh sách
  addSachYeuCau({ commit }, sachId) {
    commit("ADD_SACH_YEU_CAU", sachId);
  },

  // Xóa một sách khỏi danh sách
  removeSachYeuCau({ commit }, sachId) {
    commit("REMOVE_SACH_YEU_CAU", sachId);
  },

  // Reset danh sách
  resetSachYeuCau({ commit }) {
    commit("RESET_SACH_YEU_CAU");
  },
};

const mutations = {
  // Thêm một sách vào danh sách nếu chưa tồn tại
  ADD_SACH_YEU_CAU(state, sachId) {
    if (!state.sachYeuCau.includes(sachId)) {
      state.sachYeuCau.push(sachId);
    }
  },

  // Xóa một sách khỏi danh sách
  REMOVE_SACH_YEU_CAU(state, sachId) {
    state.sachYeuCau = state.sachYeuCau.filter((id) => id !== sachId);
  },

  // Reset danh sách về rỗng
  RESET_SACH_YEU_CAU(state) {
    state.sachYeuCau = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
