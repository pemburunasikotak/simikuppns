import { FormLabel, styled } from "@mui/material";

const InputLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 700,
  color: "#333",

  marginBottom: "8px",
  "& .MuiFormLabel-asterisk": {
    color: theme.palette.error.main,
  },
}));

export default InputLabel;
