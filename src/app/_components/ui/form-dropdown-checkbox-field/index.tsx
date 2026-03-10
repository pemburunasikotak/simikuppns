import {
  Checkbox,
  Chip,
  FormControl,
  FormLabel,
  ListItemText,
  MenuItem,
  Select,
  OutlinedInput,
  Box,
  Typography,
} from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import HelperText from "../helper-text";

type DropdownOption = {
  value: string;
  label: string;
};

type Props<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  defaultValue?: string[];
  placeholder?: string;
  required?: boolean;
  options: DropdownOption[];
  multiple?: boolean;
};

const FormDropdownCheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  required = false,
  options,
  placeholder,
  multiple = true,
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormControl
          variant="outlined"
          fullWidth
          error={fieldState.invalid}
          sx={{ backgroundColor: "white" }}
        >
          {label && (
            <FormLabel required={required} error={fieldState.invalid}>
              {label}
            </FormLabel>
          )}

          <Select
            multiple={multiple}
            {...field}
            value={field.value || []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            input={<OutlinedInput />}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                return (
                  <Typography color="textSecondary">{placeholder || `Pilih ${label}`}</Typography>
                );
              }

              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((val) => {
                    const label = options.find((opt) => opt.value === val)?.label || val;
                    return (
                      <Chip
                        key={val}
                        sx={{
                          border: "1px solid #264533",
                          backgroundColor: "#ffffff",
                          color: "#264533",
                          borderRadius: "10px",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                        label={label}
                      />
                    );
                  })}
                </Box>
              );
            }}
          >
            <MenuItem disabled value="">
              {placeholder || `Pilih ${label}`}
            </MenuItem>

            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {multiple && <Checkbox checked={field.value?.includes(option.value)} />}
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>

          {fieldState.error && <HelperText error>{fieldState.error.message}</HelperText>}
        </FormControl>
      )}
    />
  );
};

export default FormDropdownCheckboxField;
