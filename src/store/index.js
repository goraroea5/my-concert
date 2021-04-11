import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user.js";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
  },

  plugins: [new VuexPersistence().plugin],
});
