import React from "react";
import { AssignmentOutlined, CloudDownloadOutlined, DeleteOutline, EditOutlined, Lock, VisibilityOutlined } from "@mui/icons-material";
import { ButtonProps, Button as MuiButton, Stack, styled, Tooltip } from "@mui/material";

export type ItemType = "detail" | "delete" | "edit" | "lock" | "assign" | "download";

export interface ActionButtonItem {
  key: React.Key;
  type?: ItemType;
  label?: string;
  icon?: React.ReactNode;
  color?: ButtonProps["color"];
  onClick?: () => void;
  disabled?: boolean;
  render?: React.ReactNode;
  href?: string;
  target?: string;
  download?: boolean | string;
}

export interface Props {
  items: ActionButtonItem[];
}

const Button = styled(MuiButton)(() => ({
  padding: "8px",
  minWidth: "auto",
}));

const ActionButtonTable = ({ items = [] }: Props) => {
  const itemColor: Record<ItemType, ButtonProps["color"]> = {
    detail: "info",
    delete: "error",
    edit: "warning",
    lock: "warning",
    assign: "primary",
    download: "success",
  };

  const itemIcon: Record<ItemType, React.ReactNode> = {
    detail: <VisibilityOutlined fontSize="small" />,
    delete: <DeleteOutline fontSize="small" />,
    edit: <EditOutlined fontSize="small" />,
    lock: <Lock fontSize="small" />,
    assign: <AssignmentOutlined fontSize="small" />,
    download: <CloudDownloadOutlined fontSize="small" />,
  };

  const itemLabel: Record<ItemType, string> = {
    detail: "Detail",
    delete: "Hapus",
    edit: "Ubah",
    lock: "Kunci",
    assign: "Tugaskan",
    download: "Unduh / Download",
  };

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {items.map((item) => {
        if (item.render) {
          return <React.Fragment key={item.key}>{item.render}</React.Fragment>;
        }

        const label = item.label || (item.type ? itemLabel[item.type] : "");

        const buttonBtn = (
          <Button
            variant="text"
            color={item.type ? itemColor[item.type] : item.color}
            onClick={item.onClick}
            size="small"
            disabled={item.disabled}
          >
            {item.icon ? item.icon : (item.type ? itemIcon[item.type] : undefined)}
          </Button>
        );

        return (
          <Tooltip key={item.key} title={label} arrow placement="top">
            <span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.target || "_blank"}
                  download={item.download}
                  style={{ textDecoration: "none" }}
                  rel="noreferrer"
                >
                  {buttonBtn}
                </a>
              ) : (
                buttonBtn
              )}
            </span>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default ActionButtonTable;
