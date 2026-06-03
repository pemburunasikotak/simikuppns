import Cookies from "js-cookie";

export const SessionToken = {
  set: (val: { access_token: string; refresh_token?: string }) => Cookies.set("simiku_token", JSON.stringify(val)),
  get: ():
    | {
      access_token: string;
      refresh_token?: string;
    }
    | undefined => {
    const token = Cookies.get("simiku_token");
    if (!token) return undefined;
    try {
      return JSON.parse(token);
    } catch {
      return undefined;
    }
  },
  remove: () => Cookies.remove("simiku_token"),
};
