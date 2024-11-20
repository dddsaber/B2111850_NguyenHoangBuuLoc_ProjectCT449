<template>
  <a-layout style="margin: 0">
    <a-layout-header>
      <h2 style="color: white; margin: 0; padding: 10px">Quản lý sách</h2>
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
          v-model:value="keyword"
          placeholder="Tìm kiếm..."
          @pressEnter="handleSearch"
        />
        <a-select
          @change="handleSearch"
          style="width: 150px"
          placeholder="Thể loại"
          v-model:value="status"
        >
          <a-select-option
            v-for="item in theloaiOptions"
            :key="item.key"
            :value="item.value"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>

        <a-button type="primary" @click="handleSearch">
          <SearchOutlined />
        </a-button>
        <a-button @click="fetchData">
          <ReloadOutlined />
        </a-button>
      </a-space>
      <a-button type="primary" @click="showModal">
        <BookOutlined /> Sách đã chọn
      </a-button>
    </a-space>
    <a-layout-content style="margin: 10px 20px">
      <a-row style="justify-content: space-between">
        <a-col
          v-for="book in books"
          :key="book.id"
          :span="4"
          style="margin-bottom: 30px; margin-right: 10px"
        >
          <a-card
            class="book-card"
            style="position: relative; overflow: hidden"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
              "
            >
              <img
                :src="getSourceBookImage(book.image)"
                :alt="book.tensach"
                style="width: 80%; margin-bottom: 10px"
              />
              <p
                style="
                  text-align: center;
                  font-weight: bold;
                  text-overflow: ellipsis;
                  line-height: 1;
                  white-space: nowrap;
                "
              >
                {{ book.tensach }}
              </p>
              <a-button
                type="primary"
                style="margin: 10px 0"
                @click="selectBook(book._id)"
              >
                Select
              </a-button>
              <a-popover trigger="hover" title="Thông tin sách">
                <template #content>
                  <div
                    style="
                      text-align: left;
                      max-width: 400px;
                      word-wrap: break-word;
                      max-height: 600px;
                      overflow-y: auto;
                    "
                  >
                    <strong>Tên sách:</strong> {{ book.tensach || "Không rõ"
                    }}<br />
                    <strong>Đơn giá:</strong> {{ book.dongia || "Không rõ"
                    }}<br />
                    <strong>Số quyển:</strong> {{ book.soquyen || 0 }}<br />
                    <strong>Cho mượn:</strong> {{ book.chomuon ? "Có" : "Không"
                    }}<br />
                    <strong>Năm xuất bản:</strong>
                    {{ book.namxuatban || "Không rõ" }}<br />
                    <strong>Tác giả:</strong> {{ book.tacgia || "Không rõ"
                    }}<br />
                    <strong>Thể loại:</strong> {{ book.theloai || "Khác"
                    }}<br />
                    <strong>Giới thiệu:</strong>
                    {{ book.gioithieu || "Chưa có giới thiệu" }}
                  </div>
                </template>
                <a-button type="link">Xem giới thiệu</a-button>
              </a-popover>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-modal
        v-model:open="isVisible"
        title="Selected Books"
        ok-text="Muonsach"
        @ok="handleOk"
        @cancel="handleCancel"
        :destroy-on-close="true"
        cancel-text="Hủy"
        :style="{ top: '10px', width: '700px' }"
      >
        <a-list :data-source="selectedBooks" :render-item="renderItem">
          <a-list-item v-for="item in selectedBooks" :key="item.id">
            <a-row style="width: 100%">
              <a-col span="4">
                <img
                  :src="getSourceBookImage(item.image)"
                  :alt="item.tensach"
                  style="width: 50px; margin-bottom: 10px"
                />
              </a-col>

              <a-col span="14">
                <span>{{ item.tensach }}</span>
              </a-col>
              <a-col span="6">
                <a-button type="danger" @click="removeBook(item._id)">
                  Xóa
                </a-button>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
        <a-button
          @click="resetSachYeuCau"
          type="default"
          style="margin-top: 10px"
        >
          Reset
        </a-button>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import sachService from "../../services/sach.service";
import { store } from "../../redux/store";
import {
  ReloadOutlined,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { getSourceBookImage } from "../../utils/image";
import thethuvienService from "../../services/thethuvien.service";
import dayjs from "dayjs";
import theodoimuonsachService from "../../services/theodoimuonsach.service";
export default {
  components: {
    ReloadOutlined,
    SearchOutlined,
    BookOutlined,
  },
  setup() {
    const loading = ref(false);
    const books = ref([]);
    const filter = ref({ searchKey: "" });
    const isVisible = ref(false);
    const user = store.getters["auth/user"];
    const keyword = ref("");
    const status = ref("");
    const theloaiOptions = ref([
      { key: "", value: "Tất cả" },
      { key: "tienganh", value: "Tiếng Anh" },
      { key: "tiengviet", value: "Tiếng Việt" },
      { key: "vanhoa", value: "Văn hóa" },
      { key: "khoahoc", value: "Khoa học" },
      { key: "vanhoc", value: "Văn học" },
      { key: "kinhte", value: "Kinh tế" },
      { key: "tamly", value: "Tâm lý" },
      { key: "giaoduc", value: "Giáo dục" },
      { key: "lichsu", value: "Lịch sử" },
      { key: "tinhcam", value: "Tình cảm" },
      { key: "thieunhi", value: "Thiếu nhi" },
      { key: "trinhtham", value: "Trinh thám" },
      { key: "tieuthuyet", value: "Tiểu thuyết" },
      { key: "hocthuat", value: "Học thuật" },
      { key: "khac", value: "Khác" },
    ]);

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await sachService.getAll(filter.value);
        books.value = response.data.sachs || [];
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      } finally {
        loading.value = false;
      }
    };

    const triggerReload = () => {
      fetchData();
    };

    const selectedBooks = computed(() => {
      const sachIds = store.getters["sachYeuCau/getSachYeuCau"];

      return books.value.filter((book) => sachIds.includes(book._id));
    });

    const showModal = () => {
      isVisible.value = true;
    };

    const handleOk = async () => {
      if (!user) {
        notification.warning({
          message: "Thông báo",
          description: "Bạn phải có tài khoản để mượn sách.",
        });
        return;
      }
      const response = await thethuvienService.getByUserId(user._id);
      if (response.status) {
        const themuonsach = response.data;

        const ngayHetHan = dayjs(themuonsach.ngayhethan);
        const ngayHienTai = dayjs();

        if (ngayHetHan.isBefore(ngayHienTai, "day")) {
          notification.error({
            message: "Thông báo",
            description:
              "Thẻ thư viện của bạn đã hết hạn mượn sách. Vui lòng đến thư viện để gia hạn lại",
          });
          return;
        }

        const sachIds = store.getters["sachYeuCau/getSachYeuCau"];
        const record = {
          mathethuvien: themuonsach._id,
          ngaymuon: dayjs().format("YYYY-MM-DD"),
          loaimuon: "tructuyen",
          masach: sachIds,
          trangthai: "choduyet",
        };
        const tdmsRecord = await theodoimuonsachService.createOnline(record);
        if (tdmsRecord.status) {
          notification.success({
            message: "Thông báo",
            description: "Mượn sách thành công.",
          });
          isVisible.value = false;
        } else {
          notification.error({
            message: "Thông báo",
            description: "Mượn sách thất bại.",
          });
        }
      } else {
        notification.warning({
          message: "Thông báo",
          description:
            "Bạn phải có thẻ thư viện để mượn sách. Vui lòng đến thư viện để làm thẻ mượn sách",
        });
        return;
      }
    };

    const handleCancel = () => {
      isVisible.value = false;
    };

    const selectBook = (bookId) => {
      const selectedBooksCount = selectedBooks.value.length;
      if (selectedBooksCount >= 3) {
        notification.warning({
          message: "Số lượng sách đã chọn",
          description: "Bạn chỉ có thể chọn tối đa 3 sách.",
        });
        return;
      }
      store.dispatch("sachYeuCau/addSachYeuCau", bookId);
    };

    const removeBook = (bookId) => {
      store.dispatch("sachYeuCau/removeSachYeuCau", bookId);
    };

    const resetSachYeuCau = () => {
      store.dispatch("sachYeuCau/resetSachYeuCau");
    };

    const handleSearch = () => {
      const filteredBooks = books.value.filter((book) =>
        [book.tensach, book.nhaxuatban, book.tacgia]
          .filter((field) => field) // Lọc bỏ các giá trị null hoặc undefined
          .some((field) =>
            field.toLowerCase().includes(keyword.value.toLowerCase())
          )
      );

      const filteredByStatus = filteredBooks.filter((book) => {
        if (!status.value || status.value === "Tất cả") {
          return true; // Nếu status là "Tất cả", không lọc
        }
        return book.theloai && book.theloai.includes(status.value);
      });
      if (
        !status.value ||
        (status.value === "Tất cả" && keyword.value === "")
      ) {
        fetchData();
        return;
      }

      // Cập nhật danh sách sách sau khi lọc
      books.value = filteredByStatus;
      keyword.value = "";
    };

    onMounted(fetchData);

    return {
      loading,
      books,
      fetchData,
      filter,
      triggerReload,
      isVisible,
      showModal,
      handleOk,
      handleCancel,
      selectBook,
      selectedBooks,
      resetSachYeuCau,
      getSourceBookImage,
      removeBook,
      keyword,
      handleSearch,
      theloaiOptions,
      status,
    };
  },
};
</script>

<style scoped>
a-layout-header {
  background: #001529;
}

a-card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s;
}

img {
  border-radius: 8px;
}
.book-card:hover .book-description {
  opacity: 1;
}
</style>
