<template>
  <a-layout>
    <a-layout-content
      style="
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #263a4d;
        position: relative;
      "
    >
      <!-- Waves Background -->
      <div class="frame">
        <div class="wave wave-back">
          <div v-for="i in 20" :key="i" class="circle"></div>
        </div>
        <div class="wave wave-middle">
          <div v-for="i in 20" :key="i" class="circle"></div>
        </div>
        <div class="wave wave-front">
          <div v-for="i in 20" :key="i" class="circle"></div>
        </div>
      </div>

      <!-- Login Form -->
      <a-form
        ref="formRef"
        :model="formState"
        @submit.prevent="onFinish"
        :initial-values="{ remember: true }"
        :style="{
          width: '450px',
          padding: '40px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1,
        }"
      >
        <a-typography-title
          level="3"
          style="
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
            color: #333;
          "
        >
          Đăng nhập
        </a-typography-title>

        <!-- Phone/Email -->
        <a-form-item
          name="identifier"
          :rules="[{ required: true, message: 'Phone/Email must be provided' }]"
        >
          <a-input
            v-model:value="formState.identifier"
            size="large"
            :prefix="UserOutlined"
            placeholder="Phone/Email"
            style="border-radius: 8px"
          />
        </a-form-item>

        <!-- Password -->
        <a-form-item
          name="password"
          :rules="[{ required: true, message: 'Password must be provided' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            :prefix="LockOutlined"
            placeholder="Password"
            style="border-radius: 8px"
          />
        </a-form-item>

        <!-- Actions -->
        <a-form-item>
          <a-button
            size="large"
            type="primary"
            html-type="submit"
            block
            style="
              margin-bottom: 15px;
              border-radius: 8px;
              background-color: #1890ff;
              border-color: #1890ff;
            "
          >
            Đăng nhập
          </a-button>
        </a-form-item>

        <!-- Registration link -->
        <a-form-item style="text-align: center">
          <a-typography>
            <a
              @click="goToRegister"
              style="cursor: pointer; color: #1890ff; font-size: 14px"
              >Chưa có tài khoản? Đăng ký</a
            >
          </a-typography>
        </a-form-item>
      </a-form>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import { store } from "../../redux/store";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "LoginPage",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter(); // Truy cập Vue Router
    const formState = reactive({
      identifier: "",
      password: "",
    });

    const onFinish = async () => {
      console.log("Form submitted");
      const { identifier, password } = formState; // Truy cập giá trị trực tiếp từ formState
      console.log(identifier, password);

      // Gọi action login từ Vuex store
      try {
        const response = await store.dispatch("auth/login", {
          identifier: identifier.trim(),
          password,
        });

        // Điều hướng người dùng sau khi đăng nhập
        if (response.status) {
          router.push("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    const goToRegister = () => {
      // Điều hướng đến trang đăng ký
      router.push("/register");
    };

    return { onFinish, formState, goToRegister };
  },
});
</script>

<style scoped>
.frame {
  position: absolute;

  width: 100%;
  height: 100%;
  border-radius: 2px;
  box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  background: #263a4d;
  color: #fff;
  font-family: "Open Sans", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.wave {
  position: absolute;
  height: 400px;
  width: 90%;
  background: #fff;
}

.circle {
  position: relative;
  float: left;
  width: 50px;
  height: 50px;
  top: -24px;
  border-radius: 50px;
}

.wave-back {
  top: 225px;
  background: #406384;
  animation: wave-back 4s ease-in-out alternate infinite;
}

.wave-back .circle:nth-child(2n + 2) {
  background: #263a4d;
}

.wave-middle {
  top: 280px;
  background: #5d90bf;
  animation: wave-middle 4s ease-in-out alternate infinite;
}

.wave-middle .circle:nth-child(2n + 2) {
  background: #406384;
}

.wave-front {
  top: 335px;
  background: #7eb3e6;
  animation: wave-front 4s ease-in-out alternate infinite;
}

.wave-front .circle:nth-child(2n + 2) {
  background: #5d90bf;
}

@keyframes wave-back {
  from {
    transform: translate3d(-20px, 0, 0);
  }
  to {
    transform: translate3d(20px, 0, 0);
  }
}

@keyframes wave-middle {
  from {
    transform: translate3d(10px, 0, 0);
  }
  to {
    transform: translate3d(-10px, 0, 0);
  }
}

@keyframes wave-front {
  from {
    transform: translate3d(-50px, 0, 0);
  }
  to {
    transform: translate3d(50px, 0, 0);
  }
}
</style>
