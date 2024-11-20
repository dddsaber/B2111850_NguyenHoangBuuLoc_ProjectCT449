<template>
  <a-layout style="margin: 0; max-height: 100vh; overflow-y: scroll">
    <a-layout-header>
      <h2 style="color: white">Quản Lý Mượn Sách</h2>
    </a-layout-header>

    <a-layout-content style="margin: 10px 10px">
      <div class="library-borrow">
        <a-row>
          <a-col :span="16">
            <div class="content">
              <a-select
                v-model="selectedUser"
                placeholder="Chọn người mượn sách"
                style="width: 100%; margin-bottom: 16px"
                showSearch
                :filterOption="filterUser"
                @change="handleUserChange"
              >
                <a-select-option
                  v-for="user in users"
                  :key="user._id"
                  :value="user._id"
                  :label="user.name"
                >
                  {{ user.name + " - " + user._id }}
                </a-select-option>
              </a-select>

              <a-select
                v-model="selectedBooks"
                placeholder="Chọn sách theo tiêu đề, tác giả..."
                style="width: 100%; margin-bottom: 16px"
                showSearch
                :filterOption="filterBook"
                @change="handleBookChange"
              >
                <!-- Xóa mode="multiple" -->
                <a-select-option
                  v-for="book in books"
                  :key="book._id"
                  :value="book._id"
                  :label="book.tensach + '-' + book.tacgia"
                >
                  {{ book.tensach }} - {{ book.tacgia }}
                </a-select-option>
              </a-select>

              <div>
                <a-table
                  :columns="copyColumns"
                  :data-source="copies"
                  row-key="_id"
                  :scroll="{ x: 500, y: 375 }"
                >
                  <template v-slot:bodyCell="{ column, record }">
                    <span v-if="column.key === 'action'">
                      <a-button
                        type="primary"
                        :disabled="record.sanco !== true"
                        v-model="selectedCopies"
                        :value="record._id"
                        @click="handleCheckboxChange(record)"
                        >{{ ">" }}</a-button
                      >
                    </span>

                    <span v-else-if="column.key === 'tensach'">{{
                      record.tensach
                    }}</span>
                    <span v-else-if="column.key === '_id'">{{
                      record._id
                    }}</span>
                    <span v-else-if="column.key === 'sanco'">{{
                      record.sanco ? "Có sẵn" : "Không có sẵn"
                    }}</span>
                  </template>
                </a-table>
              </div>
            </div>
          </a-col>

          <a-col :span="8">
            <div class="content">
              <a-card title="Thong tin muon sach" style="margin-left: 10px">
                <div>Người mượn: {{ user?.name }}</div>
                <div>
                  <a-table
                    :columns="selectedBooksColumns"
                    :data-source="selectedbooks"
                    row-key="_id"
                    :scroll="{ x: 240, y: 270 }"
                  >
                    <template v-slot:bodyCell="{ column, record }">
                      <span v-if="column.key === 'tensach'">{{
                        record.tensach
                      }}</span>
                      <span v-else-if="column.key === '_id'">{{
                        record._id
                      }}</span>
                      <span v-else-if="column.key === 'delete'">
                        <a-button
                          type="primary"
                          @click="handleDeleteCopy(record._id)"
                          size="small"
                        >
                          X
                        </a-button>
                      </span>
                    </template>
                  </a-table>
                </div>
                <a-button
                  type="primary"
                  @click="handleOk"
                  style="margin: 20px auto"
                  >Ok</a-button
                >
              </a-card>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import sachService from "../../services/sach.service";
import tdmsService from "../../services/theodoimuonsach.service";
import userService from "../../services/user.service";
import thethuvienService from "../../services/thethuvien.service";
import { store } from "../../redux/store";
import { notification } from "ant-design-vue";
import dayjs from "dayjs";
import "dayjs/locale/vi";
export default {
  name: "LibraryBorrow",
  setup() {
    const selectedUser = ref(null);
    const books = ref([]);
    const copies = ref([]);
    const users = ref([]);
    const selectedBooks = ref([]);
    const selectedCopies = ref([]);
    const user = ref(null);
    const selectedbooks = ref([]);
    const filterUser = (input, option) =>
      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    const filterBook = (input, option) =>
      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    const handleCheckboxChange = (record) => {
      const index = selectedCopies.value.indexOf(record._id);
      if (index === -1) {
        selectedCopies.value.push(record._id);
      } else {
      }
      selectedbooks.value = copies.value.filter((book) =>
        selectedCopies.value.includes(book._id)
      );
    };

    const copyColumns = [
      { title: "Tên Sách", dataIndex: "tensach", key: "tensach" },
      { title: "Mã Bản Sao", dataIndex: "_id", key: "_id" },
      { title: "Trạng Thái", dataIndex: "sanco", key: "sanco" },
      {
        title: "Chọn",
        key: "action",
        width: "100px",
      },
    ];
    const selectedBooksColumns = [
      {
        title: "Tên Sách",
        dataIndex: "tensach",
        key: "tensach",
        width: "60px",
      },
      { title: "Mã Bản Sao", dataIndex: "_id", key: "id", width: "60px" },
      {
        title: "Xóa",
        key: "delete",
        width: "30px",
      },
    ];

    const fetchCopiesForSelectedBooks = async (selected) => {
      if (!selected) return;

      try {
        const response = await sachService.getCopies(selected);
        const { bansaosach } = response.data;

        if (Array.isArray(bansaosach)) {
          // Lọc bỏ các bản sao sách đã có trong copies
          copies.value = copies.value.filter(
            (copy) =>
              !bansaosach.some(
                (bansaosachItem) => bansaosachItem._id === copy._id
              )
          );

          // Thêm các bản sao sách mới vào đầu mảng
          copies.value.unshift(...bansaosach);
        }
      } catch (error) {
        console.error(`Error fetching copies for bookId ${selected}:`, error);
      }
    };

    watch(selectedBooks, async (newSelectedBooks) => {
      await fetchCopiesForSelectedBooks(newSelectedBooks);
    });

    watch(selectedUser, async (newSelectedUser) => {
      user.value = users.value.find((user) => user._id === newSelectedUser);
    });

    const fetchData = async () => {
      try {
        const response = await sachService.getAll();
        books.value = response.data.sachs || [];

        const user_response = await userService.getUsers();
        users.value = user_response.data.users || [];
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      }
    };

    const handleBookChange = (value) => {
      selectedBooks.value = value;
    };
    const handleUserChange = (value) => {
      selectedUser.value = value;
    };

    const handleDeleteCopy = async (id) => {
      selectedbooks.value = selectedbooks.value.filter(
        (selected) => selected._id !== id
      );
      const index = selectedCopies.value.indexOf(id);

      selectedCopies.value.splice(index, 1);
    };

    const handleOk = async () => {
      const response = await thethuvienService.getByUserId(selectedUser.value);

      if (response.status) {
        const themuonsach = response.data;
        const user = store.getters["auth/user"];

        const record = {
          mathethuvien: themuonsach._id,
          mathuthu: user._id,
          ngaymuon: dayjs().format("YYYY-MM-DD"),
          ngaytradukien: dayjs().add(2, "week").format("YYYY-MM-DD"),
          loaimuon: "tructiep",
          sachmuon: selectedCopies.value,
        };

        const tdmsRecord = await tdmsService.create(record);
        if (tdmsRecord.status) {
          notification.success({
            description: "Mượn sách thành công",
            message: "Thành công!",
          });
        } else {
          notification.error({
            description: "Mượn sách thất bại",
            message: "Error",
          });
        }
      } else {
        notification.error({
          description: response.message,
          message: "Error",
        });
      }
    };

    onMounted(fetchData);

    return {
      selectedUser,
      selectedBooks,
      books,
      copies,
      users,
      copyColumns,
      handleBookChange,
      handleCheckboxChange,
      handleOk,
      filterUser,
      filterBook,
      handleUserChange,
      user,
      selectedbooks,
      selectedBooksColumns,
      selectedCopies,
      handleDeleteCopy,
    };
  },
};
</script>

<style scoped>
.library-borrow {
  padding: 20px;
}

.available-books,
.borrowed-books {
  margin-top: 20px;
}

.selected-book-copies {
  margin-top: 20px;
}
</style>
