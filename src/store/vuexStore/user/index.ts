import { Module } from "vuex";
import { getters } from "./getters";
import { mutations } from "./mutation";
import { actions } from "./actions";
import { IUserState } from "./userStore";
import { RootState } from "../types";

export interface UserState {
  user: IUserState | null;
}

const state: UserState = {
  user: null,
};

export const userStore: Module<UserState, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
