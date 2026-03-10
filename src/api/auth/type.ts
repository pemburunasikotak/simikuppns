import { TUserItem } from "../user/type";

export type TLoginParam = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  result: {
    access_token: string;
    refresh_token: string;
  };
  data: {
    access_token: string;
    refresh_token: string;
    user: TUserItem;
    result: {
      access_token: string;
      refresh_token: string;
    }
  };
};

export type TLoginOidcParam = {
  code: string;
};

export type TLoginOidcResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    user: TUserItem;
  };
};
