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
        <a-select
          @change="handleFilterloaimuon"
          style="width: 150px"
          placeholder="Loại mượn"
        >
          <a-select-option
            v-for="item in loaimuonOptions"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option></a-select
        >

        <a-select
          @change="handleFiltertrangthai"
          style="width: 150px"
          placeholder="Trạng thái"
        >
          <a-select-option
            v-for="item in trangthaiOptions"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>

        <a-date-picker
          v-model:value="filter.ngaymuon"
          style="width: 100px"
        /><a-date-picker
          v-model:value="filter.ngaytra"
          style="width: 100px"
        /><a-date-picker
          v-model:value="filter.ngayketthuc"
          style="width: 100px"
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
          <span v-if="column.dataIndex === 'user_data'">
            {{ record[column.dataIndex].name }}
          </span>
          <span v-if="column.dataIndex === 'user_email'">
            {{ record["user_data"].email }}
          </span>
          <span v-else-if="column.dataIndex === 'ngaymuon'">
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
          <span v-else-if="column.dataIndex === 'sachtra'">
            <span v-for="(name, index) in record.bookNamesReturn" :key="index">
              {{ name }}
              <span v-if="index < record.bookNamesReturn.length - 1">, </span>
            </span>
          </span>
          <span v-else-if="column.dataIndex === 'trangthai'">
            {{ trangthai[record[column.dataIndex]] }}
          </span>
          <span v-else-if="column.dataIndex === 'loaimuon'">
            {{ loaimuon[record[column.dataIndex]] }}
          </span>
          <span v-else-if="column.dataIndex === 'action'">
            <a-button type="primary" @click="handleEdit(record)">{{
              ">"
            }}</a-button>
            <a-button type="link" @click="handleSendMail(record)">{{
              "Mail"
            }}</a-button>
          </span>
        </template>
      </a-table>
      <a-modal
        v-model:open="isVisible"
        :title="'Thông tin mượn sách'"
        :ok-text="'Cập nhật'"
        cancel-text="Hủy"
        :destroy-on-close="true"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-form
          :model="formState"
          ref="formRef"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="Mã thẻ" name="mathethuvien">
            <a-input v-model:value="formState.mathethuvien" />
          </a-form-item>

          <a-form-item label="Mã Thủ thư" name="mathuthu">
            <a-input v-model:value="formState.mathuthu" />
          </a-form-item>

          <a-form-item label="Ngày mượn" name="ngaymuon">
            <a-date-picker
              v-model:value="formState.ngaymuon"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="Ngày trả" name="ngaytra">
            <a-date-picker
              v-model:value="formState.ngaytra"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="Loại mượn" name="loaimuon">
            <a-select v-model:value="formState.loaimuon">
              <a-select-option
                v-for="item in loaimuonOptions"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option></a-select
            >
          </a-form-item>

          <a-form-item label="Trạng thái" name="trangthai">
            <a-select v-model:value="formState.trangthai">
              <a-select-option
                v-for="item in trangthaiOptions"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Sách mượn" name="sachmuon">
            <a-select
              mode="multiple"
              style="width: 100%"
              @change="handleSachMuonChange"
            >
              <a-select-option
                v-for="copy in selectedCopy"
                :key="copy._id"
                :value="copy._id"
                :label="copy.masach.tensach"
              >
                {{ copy.masach.tensach }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="sachtra"></a-form-item>
          <a-form-item name="ngaytradukien"></a-form-item>
        </a-form>
      </a-modal>
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
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { store } from "../../redux/store";
import mailService from "../../services/mail.service";
export default {
  components: {
    ReloadOutlined,
    SearchOutlined,
  },
  setup() {
    const loading = ref(false);
    const tdmsRecords = ref([]);
    const books = ref([]);
    const keyword = ref("");
    const selectedCopy = ref([]);
    const selectedReturn = ref(null);
    const isVisible = ref(false);
    const user = store.getters["auth/user"];
    const filter = ref({
      docgia: null,
      ngaymuon: null,
      ngaytra: null,
      ngayketthuc: dayjs(),
      trangthai: null,
      loaimuon: null,
    });

    const loaimuonOptions = [
      { key: "tructiep", value: "Trực tiếp" },
      { key: "tructuyen", value: "Trực tuyến" },
      { key: null, value: "Không xác định" },
    ];

    const trangthaiOptions = [
      { key: "dangmuon", value: "Đang mượn" },
      { key: "dahuy", value: "Đã hủy" },
      { key: "datra", value: "Đã trả" },
      { key: "choduyet", value: "Chờ duyệt" },
      { key: "giahan", value: "Gia hạn" },
      {
        key: null,
        value: "Tất cả",
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
      null: "Tất cả",
      giahan: "Gia hạn",
    };

    const handleFilterloaimuon = (selected) => {
      console.log(selected);
      filter.value.loaimuon = selected;
    };
    const handleFiltertrangthai = (selected) => {
      filter.value.trangthai = selected;
    };

    const formState = reactive({
      mathethuvien: "",
      mathuthu: "",
      ngaymuon: undefined,
      ngaytra: undefined,
      ngaytradukien: undefined,
      loaimuon: "tructiep",
      trangthai: "dangmuon",
      sachmuon: [],
      sachtra: [],
    });
    const formRef = ref();

    const columns = [
      {
        title: "Độc giả",
        dataIndex: "user_data",
        key: "user_data",
      },
      {
        title: "Email",
        dataIndex: "user_email",
        key: "user_email",
      },
      {
        title: "Mã thẻ",
        dataIndex: "mathethuvien",
        key: "mathethuvien",
      },
      {
        title: "Sách mượn",
        dataIndex: "sachmuon",
        key: "sachmuon",
      },
      {
        title: "Sách trả",
        dataIndex: "sachtra",
        key: "sachtra",
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
        title: "Chọn",
        fixed: "right",
        dataIndex: "action",
        key: "action",
      },
    ];

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await tdmsService.getAll(filter.value);
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

        const bookNamesR = await Promise.all(
          record.sachtra.map(async (id) => {
            const response = await bansaosachsService.getById(id);

            return response.status ? response.data.masach.tensach : "";
          })
        );
        record.bookNamesReturn = bookNamesR;
      }
    });

    const handleEdit = async (record) => {
      formState.mathethuvien = record.mathethuvien;
      if (record.mathuthu) {
        formState.mathuthu = record.mathuthu;
      } else {
        formState.mathuthu = user._id;
      }

      formState.ngaymuon = dayjs(record.ngaymuon);

      formState.ngaytra = dayjs();

      formState.loaimuon = record.loaimuon;

      formState.trangthai = record.trangthai;
      if (record.trangthai === "giahan") {
        formState.ngaytradukien = dayjs(record.ngaytradukien)
          .add(2, "week")
          .format("YYYY-MM-DD");
      }

      formState.sachmuon = record.sachmuon;

      formState.sachtra = record.sachtra ?? [];
      const copies = await Promise.all(
        record.sachmuon
          .filter((id) =>
            record.sachtra ? !record.sachtra.includes(id) : true
          )
          .map(async (id) => {
            const response = await bansaosachsService.getById(id);
            return response.data;
          })
      );

      selectedCopy.value = copies;
      selectedReturn.value = record;
      isVisible.value = true;
    };
    const handleSachMuonChange = (selected) => {
      // Tìm ra những sách mới được chọn để thêm vào
      const addedBooks = selected.filter(
        (id) => !formState.sachtra.includes(id)
      );

      // Tìm ra những sách bị bỏ chọn để loại bỏ
      const removedBooks = formState.sachtra.filter(
        (id) =>
          !selected.includes(id) && !selectedReturn.value.sachtra.includes(id)
      );

      // Đẩy sách mới vào mảng sachtra
      formState.sachtra.push(...addedBooks);

      // Loại bỏ những sách không còn được chọn
      formState.sachtra = formState.sachtra.filter(
        (id) => !removedBooks.includes(id)
      );
    };
    const handleOk = async () => {
      try {
        const values = await formRef.value.validate();

        const response = await tdmsService.updateTrangThai(
          selectedReturn.value._id,
          {
            ...values,
          }
        );
        if (response.status) {
          notification.success({
            message: "Success!",
            description: "Cập nhật trạng thái thành công",
          });
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
      isVisible.value = false;
      triggerReload();
      fetchData();
    };
    const handleCancel = () => {
      isVisible.value = false;
    };

    const handleSearch = () => {
      filter.value.docgia = keyword.value;
      console.log("filter", filter.value);
      fetchData();
    };

    const triggerReload = () => {
      fetchData();
    };

    const handleSendMail = async (record) => {
      const email = record.user_data.email;
      const name = record.user_data.name;
      const subject = "Thông báo quá hạn mượn sách từ thư viện";
      const text = `
        Chào bạn ${name},
        Thư viện của bạn đã gửi thông báo quá hạn mượn sách cho bạn.
        Sách mà bạn đã mượn: ${record.bookNames.join(", ")}
        Hạn trả: ${dayjs(record.ngaytradukien).format("DD/MM/YYYY")}
        Vui lòng giao sách hoặc đăng ký gia hạn.
        Nếu thông tin có sai sót hoặc hạn mượn sách vẫn còn,
        Liên hệ thủ thư qua email:nhbl1.loc@gmail.com để làm việc!`;

      try {
        const response = await mailService.sendmail({
          email,
          subject,
          text,
        });
        if (response.status) {
          notification.success({
            message: "Success!",
            description: "Gửi email thành công",
          });
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
      handleSearch,
      loading,
      tdmsRecords,
      keyword,
      filter,
      fetchData,
      triggerReload,
      columns,
      books,
      dayjs,
      handleEdit,
      isVisible,
      handleOk,
      handleCancel,
      formState,
      formRef,
      trangthaiOptions,
      loaimuonOptions,
      selectedCopy,
      handleSachMuonChange,
      handleFiltertrangthai,
      handleFilterloaimuon,
      filter,
      loaimuon,
      trangthai,
      handleSendMail,
    };
  },
};
</script>
