<template>
  <div>
    <h1>{{ title }}</h1>
    <input v-model="inputValue" placeholder="Nhập gì đó..." />
    <button @click="handleClick">Gửi</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "MyComponent",
  setup() {
    // Tạo các biến trạng thái
    const title = ref("Component Vue 3 với Composition API");
    const inputValue = ref("");
    const message = ref("");

    // Tạo một computed property
    const inputLength = computed(() => {
      return inputValue.value.length;
    });

    // Tạo một phương thức
    const handleClick = () => {
      if (inputValue.value) {
        message.value = `Bạn đã nhập: ${inputValue.value} (Độ dài: ${inputLength.value})`;
        inputValue.value = ""; // Reset input
      } else {
        message.value = "Vui lòng nhập một giá trị.";
      }
    };

    // Trả về các biến và phương thức
    return {
      title,
      inputValue,
      message,
      handleClick,
      inputLength,
    };
  },
};
</script>

<style scoped>
/* Thêm style nếu cần */
h1 {
  color: #42b983;
}
</style>
