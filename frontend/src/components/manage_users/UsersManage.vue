<template>
  <a-layout style="margin: 0">
    <a-layout-header>
      <h2 style="color: white">Quản lý người dùng</h2>
    </a-layout-header>
    <a-space
      :size="10"
      :style="{
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
      }"
    >
      <a-space :size="10">
        <a-input
          v-model:value="filter.searchKey"
          placeholder="Tìm kiếm..."
          @pressEnter="handleSearch"
        />
        <a-select
          @change="handleSearch"
          style="width: 150px"
          placeholder="Thể loại"
          v-model:value="filter.userType"
        >
          <a-select-option
            v-for="item in userTypeoptions"
            :key="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="triggerReload">
          <SearchOutlined />
        </a-button>
        <a-button @click="fetchData">
          <ReloadOutlined />
        </a-button>
      </a-space>
      <a-button type="primary" @click="showModal">
        <PlusOutlined /> Thêm người dùng
      </a-button>
    </a-space>
    <a-layout-content style="margin: 10px 20px">
      <a-table
        :columns="columns"
        :dataSource="users"
        rowKey="_id"
        bordered
        :scroll="{ x: 'max-content', y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.dataIndex === 'userType'">
            {{ record.userType == "admin" ? "Thủ thư" : "Độc giả" }}
          </span>
          <span v-else-if="column.key === 'action'">
            <a-popconfirm title="Edit" @confirm="handleEditUser(record)">
              <a-button><EditOutlined /></a-button>
            </a-popconfirm>
            <a-popconfirm title="Delete" @confirm="handleDeleteUser(record)">
              <a-button><DeleteOutlined /></a-button>
            </a-popconfirm>
            <a-popconfirm
              title="The thu vien"
              @confirm="handleEditCard(record)"
            >
              <a-button><CalendarOutlined /></a-button>
            </a-popconfirm>
          </span>
          <span v-else>{{ record[column.dataIndex] }}</span>
        </template>
      </a-table>

      <a-modal
        v-model:open="isVisible"
        :title="selectedUser ? 'Cập nhật người dùng' : 'Thêm người dùng'"
        :ok-text="selectedUser ? 'Cập nhật' : 'Thêm'"
        @ok="handleOk"
        @cancel="handleCancel"
        :destroy-on-close="true"
        cancel-text="Hủy"
      >
        <a-form ref="formRef" :model="formState" :rules="rules">
          <a-form-item label="Tên" name="name">
            <a-input
              v-model:value="formState.name"
              placeholder="Nhập tên người dùng"
            />
          </a-form-item>
          <a-form-item label="Email" name="email">
            <a-input v-model:value="formState.email" placeholder="Nhập email" />
          </a-form-item>
          <a-form-item label="Loại người dùng" name="userType">
            <a-select v-model:value="formState.userType">
              <a-select-option value="user">User</a-select-option>
              <a-select-option value="admin">Admin</a-select-option>
            </a-select>
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
        </a-form>
      </a-modal>

      <a-modal
        v-model:open="isVisibleCard"
        :title="'Cập nhật Thẻ Thư Viện'"
        :ok-text="'Cập nhật'"
        @ok="handleOkCard"
        @cancel="handleCancelCard"
        :destroy-on-close="true"
        cancel-text="Hủy"
      >
        <a-card>
          <p>Ngày gia hạn gần nhất: {{ thethuvien.ngaygiahan }}</p>
          <p>Ngày hết hạn: {{ thethuvien.ngayhethan }}</p>
          <p>
            Trạng thái:
            {{ thethuvien.trangthai === "conhieuluc" ? "Còn hạn" : "Hết hạn" }}
          </p>
        </a-card>
        <a-form ref="formRefCard" :model="cardformState" :rules="rules">
          <a-form-item label="Ngày gia hạn" name="ngaygiahan">
            <a-date-picker
              v-model:value="cardformState.ngaygiahan"
              placeholder="Chọn ngày gia hạn"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="Thời gian gia hạn (tháng)" name="thoigiangiahan">
            <a-input-number
              v-model:value="cardformState.thoigiangiahan"
              placeholder="Nhập số tháng gia hạn"
              style="width: 100%"
              min="1"
            />
          </a-form-item>
          <a-form-item label="ID Người dùng" name="userId">
            <a-input
              v-model:value="cardformState.userId"
              placeholder="Nhập ID người dùng"
            />
          </a-form-item>
          <a-form-item label="Số tiền" name="sotien">
            <a-input-number
              v-model:value="cardformState.sotien"
              placeholder="Nhập số tiền"
              style="width: 100%"
              min="0"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { onMounted, ref, reactive, h } from "vue";
import userService from "../../services/user.service";
import theThuVienService from "../../services/thethuvien.service";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";

export default {
  components: {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
  },
  setup() {
    const users = ref([]);
    const isVisible = ref(false);
    const isVisibleCard = ref(false);
    const formRef = ref();
    const formRefCard = ref();
    const selectedUser = ref(null);
    const searchKey = ref("");
    const thethuvien = ref(null);
    const filter = ref({
      searchKey: "",
      userType: null,
    });
    const formState = reactive({
      name: "",
      email: "",
      phone: "",
      address: "",
      userType: "user",
    });

    const cardformState = reactive({
      ngaygiahan: dayjs(), // Initialize as dayjs object
      thoigiangiahan: 1,
      userId: "",
      sotien: 0,
    });

    const rules = {
      name: [{ required: true, message: "Vui lòng nhập tên người dùng!" }],
      email: [{ required: true, message: "Vui lòng nhập email!" }],
    };

    const handleOk = async () => {
      try {
        const values = await formRef.value.validate();
        if (selectedUser.value) {
          const response = await userService.updateUser({
            _id: selectedUser.value._id,
            ...values,
          });
          if (response.status) {
            notification.success({
              message: "Thành công!",
              description: "Thông tin người dùng đã được cập nhật.",
            });
          }
        } else {
          const record = {
            password: "12345678",
            ...values,
          };
          console.log(record);
          const response = await userService.createUser(record);
          if (response.status) {
            notification.success({
              message: "Thành công!",
              description: "Người dùng mới đã được thêm.",
            });
          }
        }
        resetFormState();
        isVisible.value = false;
        fetchData();
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
      }
    };

    const resetFormState = () => {
      Object.assign(formState, {
        name: "",
        email: "",
        phone: "",
        address: "",
        userType: "user",
      });
      selectedUser.value = null;
    };

    const fetchData = async () => {
      try {
        console.log("filter: ", filter.value);
        const response = await userService.getUsers(filter.value);
        users.value = response.data.users || [];
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    const showModal = () => {
      isVisible.value = true;
    };

    const showModalCard = () => {
      isVisibleCard.value = true;
    };

    const handleEditUser = (record) => {
      selectedUser.value = record;
      Object.assign(formState, record);
      showModal();
    };

    const handleDeleteUser = async (record) => {
      try {
        await userService.deleteUser(record._id);
        fetchData();
        notification.success({
          message: "Thành công!",
          description: "Người dùng đã được xóa.",
        });
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    };

    const handleEditCard = async (record) => {
      const response = await theThuVienService.getByUserId(record._id);

      if (response.status) {
        thethuvien.value = response.data;
      } else {
        thethuvien.value = {};
      }
      const card = {
        ngaygiahan: dayjs(), // Set ngaygiahan as a dayjs object
        thoigiangiahan: 1,
        userId: record._id,
        sotien: 100000,
      };
      Object.assign(cardformState, card);
      showModalCard();
    };

    const handleCancelCard = () => {
      isVisibleCard.value = false;
    };

    const handleOkCard = async () => {
      try {
        const values = await formRefCard.value.validate();
        const response = await theThuVienService.create(values);
        console.log(response);
        if (response.status) {
          notification.success({
            message: "Thành công!",
            description: "Thẻ thư viện đã được cập nhật.",
          });
          isVisibleCard.value = false;
        } else {
          notification.error({
            message: "Thất bại!",
            description: response.message,
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thẻ thư viện:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    const columns = [
      { title: "Tên", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
      { title: "Địa chỉ", width: 100, dataIndex: "address", key: "address" },
      {
        title: "Loại người dùng",
        dataIndex: "userType",
        key: "userType",
      },
      {
        title: "Hành động",
        key: "action",
        fixed: "right",
      },
    ];
    const userTypeoptions = [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
      { label: "All", value: null },
    ];

    const handleSearch = () => {
      fetchData();
      filter.value.searchKey = "";
    };

    const triggerReload = async () => {
      await fetchData();
    };

    return {
      users,
      isVisible,
      formRef,
      formState,
      columns,
      handleOk,
      resetFormState,
      fetchData,
      showModal,
      showModalCard,
      handleEditUser,
      handleDeleteUser,
      rules,
      isVisibleCard,
      handleOkCard,
      handleCancelCard,
      cardformState,
      searchKey,
      formRefCard,
      handleEditCard,
      thethuvien,
      filter,
      triggerReload,
      handleSearch,
      userTypeoptions,
    };
  },
};
</script>
