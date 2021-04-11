const state = () => ({
  // user: {
  //   name: "admin",
  //   role: "0",
  // },
  user: null,
  cart: [],
  concert: null,
});

const getters = {
  getUser: (state) => {
    return state.user;
  },
  getCart: (state) => {
    return state.cart;
  },
  getConcert: (state) => {
    return state.concert;
  },
};

const mutations = {
  SET_CONCERT(state, data) {
    state.concert = {
      ...data,
    };
  },
  SET_USER(state, user) {
    state.user = {
      ...user,
    };
  },
  LOGOUT_USER(state) {
    state.user = null;
    state.cart = [];
  },
  SET_CART(state, data) {
    state.cart.push(data);
  },
  DELETE_ITEMCART(state, index) {
    state.cart.splice(index, 1);
  },
  CLEAR_CART(state) {
    state.cart = [];
  },
  CLEAR_CONCERT(state) {
    state.concert = null;
  },
};

const actions = {
  setConcert({ commit }, data) {
    commit("SET_CONCERT", data);
  },
  setUser({ commit }, data) {
    commit("SET_USER", data);
  },
  setCart({ commit }, data) {
    commit("SET_CART", data);
  },
  deleteItemCart({ commit }, index) {
    commit("DELETE_ITEMCART", index);
  },
  clearCart({ commit }) {
    commit("CLEAR_CART");
  },
  logout({ commit }) {
    commit("LOGOUT_USER");
    commit("CLEAR_CART");
    commit("CLEAR_CONCERT");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
