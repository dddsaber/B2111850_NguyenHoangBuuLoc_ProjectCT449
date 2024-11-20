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
        <a-typography-title level="3" style="text-align: center"
          >Register</a-typography-title
        >

        <!-- Email -->
        <a-form-item
          name="email"
          :rules="[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]"
        >
          <a-input
            v-model:value="formState.email"
            size="large"
            :prefix="UserOutlined"
            placeholder="Email"
          />
        </a-form-item>

        <!-- Phone -->
        <a-form-item
          name="phone"
          :rules="[
            { required: true, message: 'Phone number is required' },
            {
              pattern: /^(\+?\d{1,4}|\d{1,4})?(\d{10})$/,
              message: 'Please enter a valid phone number',
            },
          ]"
        >
          <a-input
            v-model:value="formState.phone"
            size="large"
            :prefix="UserOutlined"
            placeholder="Phone Number"
          />
        </a-form-item>

        <!-- Password -->
        <a-form-item
          name="password"
          :rules="[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            :prefix="LockOutlined"
            placeholder="Password"
          />
        </a-form-item>

        <!-- Confirm Password -->
        <a-form-item
          name="confirmPassword"
          :rules="[
            { required: true, message: 'Confirm password is required' },
            { validator: validateConfirmPassword },
          ]"
        >
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            :prefix="LockOutlined"
            placeholder="Confirm Password"
          />
        </a-form-item>

        <!-- Actions -->
        <a-form-item>
          <a-button
            size="large"
            type="primary"
            html-type="submit"
            block
            :style="{ marginBottom: '10px' }"
          >
            Register
          </a-button>
        </a-form-item>

        <!-- Existing User -->
        <a-typography-paragraph style="text-align: center">
          Already have an account? <a @click="navigateToLogin">Login here</a>
        </a-typography-paragraph>
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
  name: "RegisterPage",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter(); // Truy cập Vue Router
    const formState = reactive({
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    const validateConfirmPassword = (_, value) => {
      if (value && value !== formState.password) {
        return Promise.reject(new Error("The two passwords do not match!"));
      }
      return Promise.resolve();
    };

    const onFinish = async () => {
      console.log("Form submitted");
      const { email, phone, password } = formState; // Truy cập giá trị trực tiếp từ formState
      console.log(email, phone, password);

      // Gọi action register từ Vuex store
      try {
        const response = await store.dispatch("auth/register", {
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
        console.log(response);

        if (response.status) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Registration failed:", error);
      }
    };

    const navigateToLogin = () => {
      router.push("/login");
    };

    return { onFinish, formState, validateConfirmPassword, navigateToLogin };
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
