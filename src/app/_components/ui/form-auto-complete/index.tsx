import React from "react";
import { Autocomplete, AutocompleteProps, FormControl, FormLabel } from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import HelperText from "../helper-text";
import BaseInputText from "../base-input-text";

type DropdownOption = {
  value: string | number;
  label: string;
};

type Props<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  defaultValue?: DropdownOption;
  placeholder?: string;
  required?: boolean;
  options: DropdownOption[];
  handleSearch?: (e: React.SyntheticEvent, value: string) => void;
  freeSolo?: boolean;
};

const FormAutoCompleteField = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  required = false,
  options,
  placeholder,
  handleSearch,
  freeSolo = false,
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Tipekan field.value
        const value = field.value as DropdownOption | string | null;

        const autoCompleteProps: AutocompleteProps<
          DropdownOption | string,
          false,
          boolean,
          boolean
        > = {
          freeSolo,
          options,
          value,
          defaultValue,
          onChange: (_event, newValue) => {
            field.onChange(newValue);
          },
          onBlur: field.onBlur,
          isOptionEqualToValue: (option, selectedValue) => {
            if (typeof option === "string" || typeof selectedValue === "string") {
              return option === selectedValue;
            }
            return option.value === selectedValue?.value;
          },
          getOptionLabel: (option) => {
            if (typeof option === "string") return option;
            return option.label || "";
          },
          renderInput: (params) => <BaseInputText {...params} placeholder={placeholder} />,
          onInputChange: handleSearch,
          fullWidth: true,
          sx: {
            "& .MuiAutocomplete-input": {
              paddingLeft: "8.5px !important",
            },
          },
        };

        return (
          <FormControl
            variant="outlined"
            fullWidth
            error={fieldState.invalid}
            sx={{
              backgroundColor: "white",
            }}
          >
            {label ? (
              <FormLabel htmlFor={field.name} error={fieldState.invalid} required={required}>
                {label}
              </FormLabel>
            ) : null}
            <Autocomplete {...autoCompleteProps} />
            {fieldState.error ? <HelperText>{fieldState.error.message}</HelperText> : null}
          </FormControl>
        );
      }}
    />
  );
};

export default FormAutoCompleteField;
