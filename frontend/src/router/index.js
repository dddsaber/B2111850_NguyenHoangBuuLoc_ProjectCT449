import { createWebHistory, createRouter } from "vue-router";
import ManageBook from "@/view/ManageBook.vue";
import BooksLending from "../components/manage_books/BooksLending.vue";
import MainLayout from "../components/layouts/MainLayout.vue";
import BookListManage from "../components/manage_books/BookListManage.vue";
import BookReturning from "../components/manage_books/BookReturning.vue";
import BookSelecting from "../components/users/BookSelecting.vue";
import Home from "../view/Home.vue";
import Login from "../view/auth/Login.vue";
import { store } from "../redux/store";
import UsersManage from "../components/manage_users/UsersManage.vue";
import BookLended from "../components/users/BookLended.vue";
import Register from "../view/auth/Register.vue";
const getUserRole = async () => {
  let user = store.getters["auth/user"];
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && !user._id) {
    // Nếu có refresh token nhưng chưa có thông tin người dùng, thực hiện re-login
    await store.dispatch("auth/relogin", refreshToken);
    user = store.getters["auth/user"]; // Lấy lại thông tin người dùng sau khi làm mới
  }
  return user ? user.userType : undefined; // Trả về role của user nếu có, ngược lại trả về undefined
};

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [{ path: "", name: "Home", component: Home }],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/manage-book",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "ManageBook",
        component: BookListManage,
      },
    ],
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/manage-user",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "ManageUser",
        component: UsersManage,
      },
    ],
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/book-lend",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "BooksLending",
        component: BooksLending,
      },
    ],
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/book-lended",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "BookLended",
        component: BookLended,
      },
    ],
  },
  {
    path: "/book-return",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "BookReturning",
        component: BookReturning,
      },
    ],
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/book-select",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "BookSelecting",
        component: BookSelecting,
      },
    ],
  },
  {
    path: "/logout",
    name: "Logout",
    beforeEnter: async (to, from, next) => {
      try {
        const user = store.getters["auth/user"];
        await store.dispatch("auth/logout", user._id);

        // Sau khi logout, chuyển hướng đến trang login
        next({ name: "login" });
      } catch (error) {
        console.error("Logout failed:", error);
        next({ name: "login" }); // Nếu có lỗi, vẫn chuyển hướng về trang login
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userRole = await getUserRole(); // Retrieve the user's role after potential re-login
  const user = store.getters["auth/user"];
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const loading = store.getters["auth/loading"];
  const refreshToken = localStorage.getItem("refreshToken");

  // Kiểm tra nếu route yêu cầu xác thực và quyền truy cập dựa trên vai trò người dùng
  if (to.meta.requiresAuth) {
    if (!isAuthenticated && refreshToken && !loading) {
      try {
        // Nếu không có người dùng, thử làm mới phiên đăng nhập
        const reloginSuccess = await store.dispatch(
          "auth/relogin",
          refreshToken
        );
        if (!reloginSuccess) {
          console.log("Re-login failed, redirecting to login...");
          next({ name: "login" }); // Chuyển hướng đến trang login nếu không làm mới phiên thành công
        } else {
          console.log("Re-login successful, proceeding to route.");
          checkRoleAccess(); // Sau khi làm mới thành công, kiểm tra lại quyền truy cập
        }
      } catch (error) {
        console.error("Re-login failed:", error);
        next({ name: "login" }); // Chuyển hướng đến trang login nếu có lỗi
      }
    } else if (isAuthenticated) {
      checkRoleAccess(); // Nếu đã đăng nhập, kiểm tra quyền truy cập
    } else {
      next({ name: "login" }); // Nếu không có refresh token, chuyển hướng đến trang login
    }
  } else {
    next(); // Nếu route không yêu cầu xác thực, cho phép truy cập
  }

  // Function to check role access after successful login or refresh
  function checkRoleAccess() {
    if (to.meta.role && to.meta.role !== userRole) {
      console.log("Access denied. Redirecting to login...");
      next({ name: "login" }); // Chuyển hướng về trang login nếu người dùng không có quyền
    } else {
      next(); // Cho phép truy cập vào route nếu người dùng có quyền
    }
  }
});

export default router;
