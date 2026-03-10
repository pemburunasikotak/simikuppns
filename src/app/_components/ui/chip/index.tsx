import { Chip as MuiChip } from "@mui/material";

export interface ChipProps {
  label: string;
  color?: string;
  bg?: string;
}

const Chip = (props: ChipProps) => {
  return (
    <MuiChip
      label={props.label}
      sx={{
        backgroundColor: props.bg,
        color: props.color,
      }}
    />
  );
};
export default Chip;
