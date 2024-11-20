<template>
  <a-layout style="margin: 0">
    <a-layout-header>
      <h2 style="color: white">Cập nhật hồ sơ</h2>
    </a-layout-header>
    <a-layout-content style="margin: 100px 20px">
      <a-row>
        <a-col :span="6">
          <a-avatar
            :src="getSourceUserImage(formState.avatar ?? null)"
            alt="Avatar"
            style="width: 300px; height: 300px; border: 3px solod black"
          />
        </a-col>
        <a-col :span="18">
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-form-item label="Tên" name="name">
              <a-input
                v-model:value="formState.name"
                placeholder="Nhập tên người dùng"
              />
            </a-form-item>
            <a-form-item label="Email" name="email">
              <a-input
                v-model:value="formState.email"
                placeholder="Nhập email người dùng"
              />
            </a-form-item>
            <a-form-item label="Số điện thoại" name="phone">
              <a-input
                v-model:value="formState.phone"
                placeholder="Nhập số điện thoại"
              />
            </a-form-item>
            <a-form-item label="Địa chỉ" name="address">
              <a-input
                v-model:value="formState.address"
                placeholder="Nhập địa chỉ"
              />
            </a-form-item>
            <a-form-item label="Avatar">
              <input type="file" @change="handleImage" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
              <a-button type="primary" @click="handleSubmit">
                Cập nhật
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { onMounted, ref, reactive } from "vue";
import { notification } from "ant-design-vue";
import fileService from "../../services/file.service";
import userService from "../../services/user.service";
import { store } from "../../redux/store";
import { getSourceUserImage } from "../../utils/image";
export default {
  setup() {
    const formRef = ref();
    const formState = reactive({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: null,
    });
    const rules = {
      name: [{ required: true, message: "Vui lòng nhập tên!" }],
      email: [{ required: true, message: "Vui lòng nhập email!" }],
    };
    const avatar = ref(null);

    const setUser = () => {
      const user = store.getters["auth/user"];
      Object.assign(formState, user);
      console.log(formState);
    };

    const handleImage = (event) => {
      const file = event.target.files[0];
      avatar.value = file;
    };

    const handleSubmit = async () => {
      try {
        const values = await formRef.value.validate();

        if (avatar.value) {
          const imageResponse = await fileService.uploadFileUser(avatar.value);
          if (imageResponse.status) {
            values.avatar = imageResponse.data.image_name;
          }
        }

        const user = store.getters["auth/user"];

        const response = await userService.updateUser({
          _id: user._id,
          ...values,
        });

        if (response.status) {
          notification.success({
            message: "Thành công!",
            description: "Hồ sơ đã được cập nhật thành công.",
          });
          location.reload();
        } else {
          notification.error({
            message: "Lỗi!",
            description: "Cập nhật không thành công.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
      }
    };

    onMounted(setUser);

    return {
      formRef,
      formState,
      rules,
      handleImage,
      handleSubmit,
      getSourceUserImage,
    };
  },
};
</script>

<style scoped>
a-layout-header {
  background: #001529;
  padding: 0 20px;
}
</style>
