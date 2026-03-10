import Cookies from "js-cookie";

export const SessionToken = {
  set: (val: { access_token: string }) => Cookies.set("token", JSON.stringify(val)),
  get: ():
    | {
      access_token: string;
    }
    | undefined => {
    const token = Cookies.get("token");
    if (!token) return undefined;
    try {
      return JSON.parse(token);
    } catch {
      return undefined;
    }
  },
  remove: () => Cookies.remove("token"),
};
