import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { Controller, Control, FieldValues, UseControllerProps } from "react-hook-form";

import HelperText from "../helper-text";

type DropdownOption = {
  value: string | number;
  label: string;
};

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, "control"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  options: DropdownOption[];
  disabled?: boolean;
};

const FormDropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  required = false,
  options,
  placeholder,
  disabled = false,
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
          disabled={disabled}
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
            disabled={disabled}
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
