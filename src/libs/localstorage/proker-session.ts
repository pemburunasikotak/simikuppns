import { TUserItem } from "@/api/user/type";

export const ProkerSessionUser = {
  set: (val: { user: TUserItem }) => localStorage.setItem("proker_users", JSON.stringify(val)),

  get: (): { user: TUserItem } | undefined => {
    const users = localStorage.getItem("proker_users");
    return users ? JSON.parse(users) : undefined;
  },

  remove: () => localStorage.removeItem("proker_users"),
};

type TSessionToken = {
  access_token: string;
  refresh_token: string;
};

export const ProkerSessionToken = {
  set: (val: TSessionToken) => localStorage.setItem("proker_token", JSON.stringify(val)),
  get: (): TSessionToken | undefined => {
    const token = localStorage.getItem("proker_token");
    return token ? JSON.parse(token) : undefined;
  },
  remove: () => localStorage.removeItem("proker_token"),
};
