import React from "react";
import { Skeleton, Stack } from "@mui/material";

interface Props {
  isEmpty?: boolean;
  loading?: boolean;
  skelatonNumber?: number;
  skelatonHeight?: number;
  children: React.ReactNode;
}

const ContentWrapper = ({
  children,
  isEmpty,
  loading,
  skelatonNumber = 1,
  skelatonHeight = 60,
}: Props) => {
  if (isEmpty) {
    return (
      <div>
        <p>Data tidak ditemukan</p>
      </div>
    );
  }

  if (loading) {
    return (
      <Stack direction="column" spacing={2}>
        {[...Array(skelatonNumber)].map((_, index) => (
          <Skeleton variant="rounded" animation="wave" height={skelatonHeight} key={index} />
        ))}
      </Stack>
    );
  }

  return children;
};
export default ContentWrapper;
