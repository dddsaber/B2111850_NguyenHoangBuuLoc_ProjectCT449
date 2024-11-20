import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Antd from "ant-design-vue";
import router from "./router";
import "ant-design-vue/dist/reset.css";
import { store } from "./redux/store";

const app = createApp(App);

app.use(store);

app.use(router);
app.use(Antd);
app.mount("#app");
