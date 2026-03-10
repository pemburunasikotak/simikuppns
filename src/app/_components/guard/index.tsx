import { FC,  PropsWithChildren, ReactNode } from "react";

// import { useSession } from "../providers/session";

type TProps = PropsWithChildren<{
  permissions: Array<string>;
  fallback?: ReactNode;
}>;

export const Guard: FC<TProps> = (props): ReactNode => {
  // const { session } = useSession();

  // const permissionKeys = useMemo(
  //   () =>
  //     session?.user?.roles?.map((role) => role.permissions.map((perm) => perm.name))?.flat() || [],
  //   [session?.user?.roles],
  // );

  // const allowed = useMemo(() => {
  //   return props.permissions.every((permission) => permissionKeys.includes(permission));
  // }, [permissionKeys, props.permissions]);

  // if (allowed) {
  //   return <Fragment>{props.children}</Fragment>;
  // }

  return props.fallback;
};
