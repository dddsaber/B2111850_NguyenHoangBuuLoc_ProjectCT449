<template>
  <a-layout style="margin: 0">
    <a-layout-header>
      <h2 style="color: white">Quản lý sách</h2>
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
          v-model:value="filter.theloaicantim"
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
        <a-button @click="triggerReload">
          <ReloadOutlined />
        </a-button>
      </a-space>
      <a-button type="primary" @click="showModal">
        <PlusOutlined /> Thêm sách
      </a-button>
    </a-space>
    <a-layout-content style="margin: 10px 20px">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="books"
        rowKey="_id"
        bordered
        :scroll="{ x: 'max-content', y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.dataIndex === 'stock'">
            <a-input-number
              v-model:value="record.stock"
              :min="1"
              @change="onStockChange(record._id, record.stock)"
            />
          </span>
          <span v-else-if="column.dataIndex === 'image'">
            <img
              :src="getSourceBookImage(record.image)"
              alt="Book Cover"
              style="width: 100px; height: auto"
            />
          </span>
          <span v-else-if="column.key === 'action'">
            <a-button @click="handleEditBook(record)"
              ><EditOutlined
            /></a-button>

            <a-popconfirm title="Block" @confirm="handleBlockBook(record)">
              <a-button><BlockOutlined /></a-button>
            </a-popconfirm>
            <a-popconfirm title="Delete" @confirm="handleDeleteBook(record)">
              <a-button><DeleteOutlined /></a-button>
            </a-popconfirm>
          </span>
          <span v-else style="text-overflow: ellipsis">
            <div
              style="
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 4;
                white-space: normal;
              "
            >
              {{ record[column.dataIndex] }}
            </div></span
          >
        </template>
      </a-table>

      <a-modal
        v-model:open="isVisible"
        :title="selectedBook ? 'Cập nhật sách' : 'Thêm sách'"
        :ok-text="selectedBook ? 'Cập nhật' : 'Thêm'"
        @ok="handleOk"
        @cancel="handleCancel"
        :destroy-on-close="true"
        cancel-text="Hủy"
        :style="{ top: '10px', width: '700px' }"
      >
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="Tên sách" name="tensach">
            <a-input
              v-model:value="formState.tensach"
              placeholder="Nhập tên sách"
            />
          </a-form-item>
          <a-form-item label="Giá (VND)" name="dongia">
            <a-input-number
              v-model:value="formState.dongia"
              :min="0"
              placeholder="Nhập giá"
            />
          </a-form-item>
          <a-form-item label="Số quyển" name="soquyen">
            <a-input-number
              v-model:value="formState.soquyen"
              :min="0"
              placeholder="Nhập số quyển"
            />
          </a-form-item>
          <a-form-item label="Trạng thái cho mượn" name="chomuon">
            <a-switch v-model:checked="formState.chomuon" />
          </a-form-item>
          <a-form-item label="Năm xuất bản" name="namxuatban">
            <a-date-picker
              v-model:value="formState.namxuatban"
              placeholder="Chọn năm xuất bản"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="Ảnh" name="image">
            <a-input
              v-model:value="formState.image"
              placeholder="Nhập đường dẫn ảnh"
            />
          </a-form-item>
          <a-form-item label="Tác giả" name="tacgia">
            <a-input
              v-model:value="formState.tacgia"
              placeholder="Nhập tên tác giả"
            />
          </a-form-item>
          <a-form-item label="Giới thiệu" name="gioithieu">
            <a-textarea
              v-model:value="formState.gioithieu"
              placeholder="Nhập giới thiệu"
            />
          </a-form-item>
          <a-form-item label="Thể loại" name="theloai">
            <a-input
              v-model:value="formState.theloai"
              placeholder="Nhập thể loại"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button style="margin-left: 10px" @click="resetFormState"
              >Đặt lại</a-button
            >
          </a-form-item>
        </a-form>
        <label for="image">Image: </label>
        <input type="file" name="image" @change="handleImage" />
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { onMounted, ref, reactive, h } from "vue";
import sachService from "../../services/sach.service";
import fileService from "../../services/file.service";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BlockOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";

import { getSourceBookImage } from "../../utils/image";

import dayjs from "dayjs";
import "dayjs/locale/vi";
export default {
  components: {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    BlockOutlined,
  },
  setup() {
    const loading = ref(false);
    const books = ref([]);
    const isVisible = ref(false);
    const formRef = ref();
    const selectedBook = ref(null);
    const filter = ref({ searchKey: "", theloaicantim: null });
    const image = ref(null);

    const formState = reactive({
      tensach: "",
      dongia: 0,
      soquyen: 0,
      chomuon: true,
      namxuatban: null,
      image: "",
      tacgia: "",
      gioithieu: "Chưa có giới thiệu",
      theloai: "Khác",
    });

    const rules = {
      tensach: [{ required: true, message: "Vui lòng nhập tên sách!" }],
      dongia: [{ required: true, message: "Vui lòng nhập giá!" }],
      soquyen: [{ required: true, message: "Vui lòng nhập số quyển!" }],
    };
    const handleSearch = () => {
      if (filter.value.theloaicantim === "Tất cả") {
        filter.value.theloaicantim = null;
      }
      fetchData();
      filter.value.searchKey = "";
    };

    const handleImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        image.value = file;
      }
    };

    const handleOk = async () => {
      try {
        const values = await formRef.value.validate();
        if (image.value) {
          const imageResponse = await fileService.uploadFileBook(image.value);
          if (imageResponse.status) {
            values.image = imageResponse.data.image_name;
          }
        }
        if (selectedBook.value) {
          console.log("update");
          console.log(values);
          console.log(selectedBook.value);
          const response = await sachService.update(
            selectedBook.value._id,
            values
          );
          if (response && response.status) {
            notification.success({
              message: "Thành công!",
              description: "Dữ liệu sách đã được cập nhật.",
            });
          }
        } else {
          console.log("ok");
          const response = await sachService.create(values);
          console.log(response);
          if (response && response.status) {
            notification.success({
              message: "Thành công!",
              description: "Dữ liệu sách đã được thêm.",
            });
          }
        }
        resetFormState();
        isVisible.value = false;
        selectedBook.value = null;
        fetchData();

        setIsVisible(false);
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
      }
    };

    const setIsVisible = (visible) => {
      isVisible.value = visible;
      if (!visible) {
        resetFormState();
      }
    };

    const resetFormState = () => {
      Object.assign(formState, {
        tensach: "",
        dongia: 0,
        soquyen: 0,
        chomuon: true,
        namxuatban: undefined,
        image: "",
        tacgia: "",
        gioithieu: "Chưa có giới thiệu",
        theloai: "Khác",
      });
      selectedBook.value = null;
    };
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
    const columns = [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: 70,
        align: "center",
      },
      {
        title: "Ảnh",
        dataIndex: "image",
        key: "image",
        width: 120,
      },
      {
        title: "Tên sách",
        dataIndex: "tensach",
        key: "tensach",
      },
      {
        title: "Giá (VND)",
        dataIndex: "dongia",
        key: "dongia",
      },
      {
        title: "Số quyển",
        dataIndex: "soquyen",
        key: "soquyen",
        width: 80,
      },
      {
        title: "Trạng thái",
        dataIndex: "chomuon",
        key: "chomuon",
        render: (text, record) => (record.chomuon ? "Cho mượn" : "Khóa"),
      },
      {
        title: "Năm xuất bản",
        dataIndex: "namxuatban",
        key: "namxuatban",
      },
      {
        title: "Tác giả",
        dataIndex: "tacgia",
        key: "tacgia",
      },
      {
        title: "Thể loại",
        dataIndex: "theloai",
        key: "theloai",
        width: 80,
      },
      {
        title: "Giới thiệu",
        dataIndex: "gioithieu",
        key: "gioithieu",
        width: 200,
      },
      {
        title: "Hành động",
        fixed: "right",
        align: "center",
        width: 180,
        key: "action",
        render: (text, record) => {
          return h("a-space", { size: "middle" }, [
            h(
              "a-tooltip",
              { title: "Chỉnh sửa thông tin" },
              {
                default: () =>
                  h("a-button", {
                    type: "text",
                    icon: h(EditOutlined),
                    onClick: () => handleEditBook(record), // Xử lý sự kiện chỉnh sửa
                  }),
              }
            ),
            h(
              "a-popconfirm",
              {
                title: "Bạn có chắc chắn xóa?",
                onConfirm: () => handleDeleteBook(record), // Xử lý sự kiện xóa
              },
              {
                default: () =>
                  h(
                    "a-button",
                    { danger: true },
                    {
                      default: () => h(DeleteOutlined),
                    }
                  ),
              }
            ),
          ]);
        },
      },
    ];

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

    const showModal = () => {
      setIsVisible(true);
    };

    const handleCancel = () => {
      setIsVisible(false);
    };
    const handleEditBook = (record) => {
      selectedBook.value = record;
      selectedBook.value.namxuatban = dayjs(selectedBook.value.namxuatban);
      formState.tensach = record.tensach;
      formState.dongia = record.dongia;
      formState.soquyen = record.soquyen;
      formState.chomuon = record.chomuon;
      formState.namxuatban = record.namxuatban;
      formState.image = record.image;
      formState.tacgia = record.tacgia;
      formState.gioithieu = record.gioithieu;
      formState.theloai = record.theloai;
      showModal();
    };

    const handleBlockBook = (record) => {};

    const handleDeleteBook = async (record) => {
      try {
        await sachService.delete(record._id);
        notification.success({
          message: "Thành công!",
          description: "Sách đã được xóa.",
        });
        fetchData(); // Refresh the list after deletion
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        notification.error({
          message: "Lỗi!",
          description: "Có lỗi xảy ra khi xóa sách.",
        });
      }
    };

    const onStockChange = async (bookId, newStock) => {
      // Xử lý cập nhật số lượng sách
      try {
        await sachService.updateStock(bookId, newStock);
        notification.success({
          message: "Thành công!",
          description: "Số lượng sách đã được cập nhật.",
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        notification.error({
          message: "Lỗi!",
          description: "Có lỗi xảy ra khi cập nhật số lượng sách.",
        });
      }
    };

    const triggerReload = () => {
      fetchData();
    };

    onMounted(fetchData);

    return {
      loading,
      books,
      isVisible,
      formRef,
      selectedBook,
      formState,
      columns,
      fetchData,
      showModal,
      handleOk,
      handleCancel,
      resetFormState,
      onStockChange,
      triggerReload,
      rules,
      handleImage,
      getSourceBookImage,
      handleEditBook,
      handleDeleteBook,
      handleBlockBook,
      filter,
      handleSearch,
      theloaiOptions,
    };
  },
};
</script>

<style scoped>
/* Thêm các quy tắc CSS tại đây nếu cần */
</style>
