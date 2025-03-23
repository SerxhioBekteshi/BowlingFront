import { eMutationTypes } from "@/assets/enums/eMutationTypes";
import axios from "axios";

const fetchUserData = async () => {
  try {
    const response = await axios.get(`/user/loggedUser`);
    if (response && response.data) return response.data;
  } catch (err) {
    console.log(err, "err in vuex fetch data");
  }
};

const userModule = {
  state: () => ({
    user: null,
  }),
  mutations: {
    setUser(state: any, user: any) {
      state.user = user;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      // Fetch user data
      const userData = await fetchUserData();
      commit(eMutationTypes.SET_USER, null);
    },
  },
};

export default userModule;
