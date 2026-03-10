import { TextField as MuiTextField, styled, TextFieldProps } from "@mui/material";

const BaseInput = styled(MuiTextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "&.Mui-disabled": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      backgroundColor: "#F0F0F0",
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 10,
  },
}));

const BaseInputText = (props: TextFieldProps) => {
  return <BaseInput {...props} />;
};

export default BaseInputText;
