<template>
  <a-layout>
    <div style="height: 100vh; z-index: 1000; background-color: white">
      <a-layout-sider
        style="
          min-height: 100vh;
          display: flex;
          padding: 0px;
          background-color: white;
        "
      >
        <a-menu
          mode="inline"
          style="background-color: white; padding: 0px; min-width: 200px"
        >
          <a-menu-item key="1">
            <a-icon type="book" />
            Books
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="user" />
            Authors
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="file-text" />
            Categories
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
    </div>
    <a-layout style="margin: 0">
      <a-layout-header>
        <h2 style="color: white">Quan ly sach</h2></a-layout-header
      >
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
          <a-tooltip title="Refresh">
            <a-button @click="handleResearch">
              <ReloadOutlined />
            </a-button>
          </a-tooltip>
          <a-input
            v-model:value="keyword"
            placeholder="Search..."
            @pressEnter="triggerReload"
          />
          <a-button type="primary" @click="triggerReload">
            <SearchOutlined />
          </a-button>
        </a-space>
        <a-button type="primary" @click="setIsVisible(true)">
          <PlusOutlined /> Add Book
        </a-button>
      </a-space>
      <a-layout-content style="margin: 10px 20px">
        <a-table
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
                @change="onStockChange(record.key, record.stock)"
              />
            </span>
            <span v-else>{{ record[column.dataIndex] }}</span>
          </template>
        </a-table>
      </a-layout-content>
      <a-layout-footer>
        <div>Copyright © 2023 Quan ly sach</div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import sachService from "../services/sach.service";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { Image } from "ant-design-vue";

export default {
  components: {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
  },
  setup() {
    const loading = ref(false);
    const reload = ref(false);
    const books = ref([]);

    const columns = [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: 70,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Anh",
        dataIndex: "image",
        key: "image",
        width: 100,
        render(image) {
          return h("img", { src: image, style: "width: 100px; height: auto;" });
        },
      },
      {
        title: "Ten sach",
        dataIndex: "tensach",
        key: "name",
      },
      {
        title: "Gia (VND)",
        dataIndex: "dongia",
        key: "price",
      },
      {
        title: "So quyen",
        dataIndex: "soquyen",
        width: 80,
        key: "soquyen",
      },
      {
        title: "Trang thai",
        dataIndex: "chomuon",
        width: 80,
        key: "chomuon",
        render: (chomuon) => (chomuon === true ? "Cho muon" : "Khoa"),
      },
      {
        title: "Nam xuat ban",
        dataIndex: "namxuatban",
        key: "namxuatban",
      },
      {
        title: "Tac gia",
        dataIndex: "tacgia",
        key: "tacgia",
      },
      {
        title: "The loai",
        dataIndex: "theloai",
        key: "theloai",
      },
      {
        title: "Gioi thieu",
        dataIndex: "gioithieu",
        key: "gioithieu",
      },
    ];

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await sachService.getAll();
        const { sachs } = response.data;

        console.log(sachs);
        books.value = sachs;
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    watch([reload], fetchData);

    const onStockChange = (key, stock) => {
      const index = books.value.findIndex((book) => book.key === key);
      if (index !== -1) {
        books.value[index].stock = stock;
      }
    };

    const saveChanges = () => {
      // Xử lý lưu thay đổi
      console.log("Changes saved", books.value);
    };

    return {
      books,
      loading,
      reload: true,
      columns,
      onStockChange,
      saveChanges,
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
