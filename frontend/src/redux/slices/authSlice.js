import authService from "../../services/auth.service";

export const authModule = {
  namespaced: true,
  state: {
    user: {},
    isAuthenticated: false,
    loading: true,
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData.user;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("token", userData.token); // Lưu access token
      localStorage.setItem("refreshToken", userData.refreshToken); // Lưu refresh token
    },
    logoutUser(state) {
      state.user = {};
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("token"); // Xóa access token
      localStorage.removeItem("refreshToken"); // Xóa refresh token
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    clearUser(state) {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
  actions: {
    async register({ commit }, body) {
      try {
        commit("setLoading", true);
        const response = await authService.register(body);
        const data = response.data;
        commit("setUser", data);
        return response;
      } catch (error) {
        console.error(error);
        commit("setLoading", false);
      }
    },
    async login({ commit }, body) {
      try {
        commit("setLoading", true);
        const response = await authService.login(body);
        const data = response.data;
        commit("setUser", data);
        return response;
      } catch (error) {
        console.error(error);
        commit("setLoading", false);
        return error;
      }
    },
    async relogin({ commit }, refreshToken) {
      try {
        commit("setLoading", true);
        const response = await authService.reAuth({ refreshToken });

        const data = response.data;
        commit("setUser", data); // Lưu thông tin người dùng và token sau khi làm mới
      } catch (error) {
        console.error(error);
        commit("setLoading", false);
        commit("clearUser"); // Xóa thông tin người dùng nếu làm mới không thành công
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },

    async logout({ commit }, userId) {
      try {
        await authService.logout(userId);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        commit("logoutUser");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  },
  getters: {
    user: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    loading: (state) => state.loading,
  },
};
