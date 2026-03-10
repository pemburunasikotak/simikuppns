import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  Switch,
  Typography,
} from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import BaseInputText from "../base-input-text";

type Props<T extends FieldValues> = UseControllerProps<T> &
  React.ComponentProps<typeof BaseInputText> & {
    label?: string;
    required?: boolean;
    endLink?: boolean;
    handleToggle?: () => void;
    toogle?: boolean;
  };

const FormTextField = <T extends FieldValues>({
  control,
  name,
  label = "",
  required = false,
  placeholder = "",
  endLink = false,
  handleToggle = () => {},
  toogle = false,
  type = "text",
  ...rest
}: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl variant="standard" sx={{ width: "100%" }}>
          {label ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor={field.name} error={fieldState.invalid} required={required}>
                {label}
              </FormLabel>
              {endLink ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" mt={1}>
                    Arahkan Ke Whatapps
                  </Typography>
                  <Switch
                    checked={toogle}
                    onChange={handleToggle}
                    color="primary"
                    slotProps={{
                      input: { "aria-label": "toggle on off" },
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <FormGroup>
            <BaseInputText
              {...rest}
              variant="outlined"
              id={field.name}
              value={field.value}
              defaultValue={rest.defaultValue || ""}
              onChange={field.onChange}
              placeholder={placeholder}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              type={type === "password" ? (!showPassword ? "password" : "text") : type}
              slotProps={{
                input:
                  type === "password"
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined,
              }}
            />
          </FormGroup>
        </FormControl>
      )}
    />
  );
};

export default FormTextField;
