import { lazy, Suspense } from "react";

import "suneditor/dist/css/suneditor.min.css";

import { FormControl, FormLabel, Skeleton } from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";
import HelperText from "../helper-text";

const Editor = lazy(() => import("suneditor-react"));

type Props<T extends FieldValues> = UseControllerProps<T> &
  SunEditorReactProps & {
    label?: string;
    required?: boolean;
  };

const FormEditorField = <T extends FieldValues>({
  control,
  name,
  label,
  required,
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
            <FormLabel htmlFor={field.name} error={fieldState.invalid} required={required}>
              {label}
            </FormLabel>
          ) : null}

          <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
            <Editor
              defaultValue={field.value}
              setContents={field.value}
              name={field.name}
              placeholder={placeholder}
              onChange={(content) => {
                field.onChange(content);
              }}
              height="300"
              setOptions={{
                buttonList: [
                  ["undo", "redo", "fontSize", "formatBlock"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "removeFormat",
                  ],
                  [
                    "fontColor",
                    "hiliteColor",
                    "outdent",
                    "indent",
                    "align",
                    "horizontalRule",
                    "list",
                    "table",
                  ],
                  ["link", "image", "fullScreen", "showBlocks", "codeView", "preview", "print"],
                ],
              }}
            />
          </Suspense>
          <HelperText style={{ color: "red" }}>
            *Image yang di inputkan tidak boleh lebih dari 5MB
          </HelperText>
          {fieldState.error ? <HelperText>{fieldState.error.message}</HelperText> : null}
        </FormControl>
      )}
    />
  );
};

export default FormEditorField;
