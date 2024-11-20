import { createStore } from "vuex";
import { authModule } from "./slices/authSlice"; // Import module auth
import sachYeuThich from "./sachyeuthich/sachYeuThich";
import sachYeuCau from "./sachyeuthich/sachYeuCau";
export const store = createStore({
  modules: {
    auth: authModule,
    sachyeuthich: sachYeuThich,
    sachYeuCau,
  },
});
