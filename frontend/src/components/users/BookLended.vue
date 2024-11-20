<template>
  <a-layout>
    <a-layout-header>
      <h2 style="color: white">Quản lý trả sách</h2>
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
        <a-tooltip title="Refresh">
          <a-button @click="fetchData">
            <ReloadOutlined />
          </a-button>
        </a-tooltip>
        <a-input
          v-model:value="keyword"
          placeholder="Tìm kiếm..."
          @pressEnter="handleSearch"
        />

        <a-button type="primary" @click="handleSearch">
          <SearchOutlined />
        </a-button>
      </a-space>
    </a-space>
    <a-layout-content style="margin: 10px 20px">
      <a-table
        :columns="columns"
        :dataSource="tdmsRecords"
        rowKey="_id"
        bordered
        :scroll="{ x: 'max-content', y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.dataIndex === 'ngaymuon'">
            {{ dayjs(record[column.dataIndex]).format("DD/MM/YYYY") }}
          </span>
          <span v-else-if="column.dataIndex === 'ngaytra'">
            {{ dayjs(record[column.dataIndex]).format("DD/MM/YYYY") }}
          </span>
          <span v-else-if="column.dataIndex === 'ngaytradukien'">
            {{ dayjs(record[column.dataIndex]).format("DD/MM/YYYY") }}
          </span>
          <span v-else-if="column.dataIndex === 'sachmuon'">
            <span v-for="(name, index) in record.bookNames" :key="index">
              {{ name }}
              <span v-if="index < record.bookNames.length - 1">, </span>
            </span>
          </span>
          <span v-else-if="column.dataIndex === 'trangthai'">
            {{ trangthai[record[column.dataIndex]] }}
          </span>
          <span v-else-if="column.dataIndex === 'loaimuon'">
            {{ loaimuon[record[column.dataIndex]] }}
          </span>
          <span v-else-if="column.dataIndex === 'action'">
            <a-button type="primary" @click="handleRenew(record)">{{
              ">"
            }}</a-button>
          </span>
        </template>
      </a-table>
    </a-layout-content>
    <a-layout-footer> </a-layout-footer>
  </a-layout>
</template>

<script>
import { notification } from "ant-design-vue";
import tdmsService from "../../services/theodoimuonsach.service";
import sachService from "../../services/sach.service";
import bansaosachsService from "../../services/bansaosachs.service";
import { onMounted, reactive, ref, watch } from "vue";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";

import { store } from "../../redux/store";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import theodoimuonsachService from "../../services/theodoimuonsach.service";
export default {
  components: {
    ReloadOutlined,
    SearchOutlined,
  },
  setup() {
    const loading = ref(false);
    const user = store.getters["auth/user"];
    const tdmsRecords = ref([]);
    const books = ref([]);
    const keyword = ref("");

    const columns = [
      {
        title: "Mã thẻ",
        dataIndex: "mathethuvien",
        key: "mathethuvien",
      },
      {
        title: "Sách",
        dataIndex: "sachmuon",
        key: "sachmuon",
      },
      {
        title: "Ngày mượn",
        dataIndex: "ngaymuon",
        key: "ngaymuon",
      },
      {
        title: "Hạn trả",
        dataIndex: "ngaytradukien",
        key: "ngaytradukien",
      },
      {
        title: "Ngày trả",
        dataIndex: "ngaytra",
        key: "ngaytra",
      },
      {
        title: "Loại mượn",
        dataIndex: "loaimuon",
        key: "loaimuon",
      },
      {
        title: "Trạng thái",
        dataIndex: "trangthai",
        key: "trangthai",
      },
      {
        title: "Gia hạn",
        dataIndex: "action",
        key: "action",
      },
    ];

    const loaimuon = {
      tructiep: "Trực tiếp",
      tructuyen: "Trực tuyến",
    };
    const trangthai = {
      dangmuon: "Đang mượn",
      dahuy: "Đã hủy",
      datra: "Đã trả",
      choduyet: "Chờ duyệt",
      giahan: "Gia hạn",
      null: "Tất cả",
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await tdmsService.getByUserId(user._id);
        if (response.status) {
          tdmsRecords.value = response.data.theodoimuonsachs;
        } else {
          notification.error({
            message: "Error!",
            description: response.message,
          });
        }
        const bookResponse = await sachService.getAll();
        books.value = bookResponse.data.sachs || [];
      } catch (error) {
        notification.error({
          message: "Error!",
          description: `Error: ${error}`,
        });
      }
    };

    const triggerReload = () => {
      fetchData();
    };

    watch(tdmsRecords, async (newRecords) => {
      for (let record of newRecords) {
        // Mỗi sách trong "sachmuon" có thể là một ID, nên chúng ta cần lấy tên sách cho mỗi ID
        const bookNames = await Promise.all(
          record.sachmuon.map(async (id) => {
            const response = await bansaosachsService.getById(id);

            return response.status ? response.data.masach.tensach : "";
          })
        );
        record.bookNames = bookNames;
      }
    });

    const handleSearch = () => {};

    const handleRenew = async (record) => {
      try {
        record.trangthai = "giahan";
        const response = await theodoimuonsachService.updateTrangThai(
          record._id,
          record
        );
        if (response.status) {
          notification.success({
            message: "Thành công!",
            description: "Gia hạn thành công",
          });
          fetchData();
        } else {
          notification.error({
            message: "Error!",
            description: response.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Error!",
          description: `Error: ${error}`,
        });
      }
    };

    onMounted(fetchData);

    return {
      triggerReload,
      loading,
      columns,
      tdmsRecords,
      user,
      books,
      dayjs,
      handleSearch,
      keyword,
      fetchData,
      loaimuon,
      trangthai,
      handleRenew,
    };
  },
};
</script>
