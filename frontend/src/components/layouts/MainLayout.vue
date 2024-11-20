<template>
  <a-layout style="max-height: 100vh">
    <div style="max-height: 100vh; z-index: 1000; background-color: white">
      <a-layout-sider
        style="
          min-height: 100vh;
          display: flex;
          padding: 0px;
          background-color: white;
          position: fixed;
        "
      >
        <a-menu
          mode="inline"
          style="background-color: white; padding: 0px; min-width: 200px"
        >
          <a-menu-item v-for="item in menuItems" :key="item.key">
            <router-link
              :to="item.link"
              style="text-decoration: none; color: inherit"
            >
              {{ item.label }}
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
    </div>
    <a-layout-content style="height: 100vh; overflow: auto; margin-left: 200px">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import {
  BookOutlined,
  LogoutOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  BarChartOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons-vue";
import { store } from "../../redux/store";
export default {
  components: {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    BarChartOutlined,
    UserOutlined,
    BookOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
  },
  setup() {
    const menuItems = [];
    menuItems.push({
      key: "0",
      label: "Trang chủ",
      link: "/",
    });
    const user = store.getters["auth/user"];

    if (user && user.userType === "admin") {
      menuItems.push({
        key: "1",
        label: "Quản lý sách",
        link: "/manage-book",
      });
      menuItems.push({
        key: "2",
        label: "Quản lý người dùng",
        link: "/manage-user",
      });
      menuItems.push({
        key: "3",
        label: "Quản lý mượn sách",
        link: "/book-lend",
      });
      menuItems.push({
        key: "4",
        label: "Quản lý trả sách",
        link: "/book-return",
      });
      menuItems.push({
        key: "5",
        label: "Chọn sách",
        link: "/book-select",
      });
      menuItems.push({
        key: "7",
        label: "Lịch sử mượn sách",
        link: "/book-lended",
      });
      menuItems.push({
        key: "10",
        label: "Đăng xuất",
        link: "/logout",
      });
    } else if (user && user.userType === "user") {
      menuItems.push({
        key: "7",
        label: "Lịch sử mượn sách",
        link: "/book-lended",
      });
      menuItems.push({
        key: "1",
        label: "Chọn sách",
        link: "/book-select",
      });
      menuItems.push({
        key: "10",
        label: "Đăng xuất",
        link: "/logout",
      });
    }

    if (!user || !user.userType) {
      menuItems.push({
        key: "1",
        label: "Chọn sách",
        link: "/book-select",
      });
      menuItems.push({
        key: "11",
        label: "Đăng nhập",
        link: "/login",
      });
      menuItems.push({
        key: "12",
        label: "Đăng ký",
        link: "/register",
      });
    }
    return {
      menuItems,
    };
  },
};
</script>

<style scoped>
.actions {
  margin-top: 20px;
  text-align: right;
}
</style>
