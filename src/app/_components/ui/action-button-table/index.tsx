import React from "react";
import { DeleteOutline, EditOutlined, Lock, VisibilityOutlined } from "@mui/icons-material";
import { ButtonProps, Button as MuiButton, Stack, styled } from "@mui/material";

type ItemType = "detail" | "delete" | "edit" | "lock";
interface Props {
  items: {
    key: React.Key;
    type?: ItemType;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    render?: React.ReactNode;
  }[];
}

const Button = styled(MuiButton)(() => ({
  padding: "8px",
  minWidth: "auto",
}));

const ActionButtonTable = ({ items }: Props) => {
  const itemColor: Record<ItemType, ButtonProps["color"]> = {
    detail: "info",
    delete: "error",
    edit: "warning",
    lock: "warning",
  };

  const itemIcon: Record<ItemType, React.ReactNode> = {
    detail: <VisibilityOutlined fontSize="small" />,
    delete: <DeleteOutline fontSize="small" />,
    edit: <EditOutlined fontSize="small" />,
    lock: <Lock fontSize="small" />,
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
      {items.map((item) =>
        item.render ? (
          item.render
        ) : (
          <Button
            key={item.key}
            variant="text"
            color={item.type ? itemColor[item.type] : undefined}
            onClick={item.onClick}
            size="small"
            disabled={item.disabled}
          >
            {item.type ? itemIcon[item.type] : undefined}
          </Button>
        ),
      )}
    </Stack>
  );
};

export default ActionButtonTable;
