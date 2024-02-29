import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
    userID: "",
  },
  mutations: {
    SET_ID(state, data) {
      state.userID = data;
    },
  },
  actions: {
    setID(state, data) {
      state.commit("SET_ID", data);
    },
  },
  plugins: [vuexLocal.plugin],
});
