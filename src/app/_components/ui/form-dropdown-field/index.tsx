import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import HelperText from "../helper-text";

type DropdownOption = {
  value: string;
  label: string;
};

type Props<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  options: DropdownOption[];
};

const FormDropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  required = false,
  options,
  placeholder,
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl
          variant="outlined"
          fullWidth
          error={fieldState.invalid}
          sx={{
            backgroundColor: "white",
          }}
        >
          {label ? (
            <FormLabel required={required} error={fieldState.invalid}>
              {label}
            </FormLabel>
          ) : null}
          {/* Dropdown */}
          <Select
            {...field}
            value={field.value || ""}
            defaultValue={defaultValue}
            onChange={field.onChange}
            onBlur={field.onBlur}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              {placeholder ? placeholder : `Pilih ${label}`}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {/* Error */}
          {fieldState.error ? <HelperText>{fieldState.error.message}</HelperText> : null}
        </FormControl>
      )}
    />
  );
};

export default FormDropdownField;
