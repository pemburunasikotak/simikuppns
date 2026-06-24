import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Add, FileDownloadOutlined, SearchOutlined } from "@mui/icons-material";
import { Box, Button, Collapse, Grid, Stack, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";

import { useDebounce } from "@/app/_hooks/use-debounce";
import { useFilter } from "@/app/_hooks/use-filter";

import FormDateField from "../form-date-field";
import FormTextField from "../form-text-field";
import FormDropdownField from "../form-dropdown-field";

type Variants = "search" | "download" | "date_range";

interface FilterProps {
  /**
   * @deprecated Use `actions` instead.
   */
  onAdd?: () => void;
  /**
   * @deprecated Use `actions` instead.
   */
  labelAdd?: string;
  withPriode?: boolean;
  /**
   * @deprecated Use `actions` instead.
   */
  withAddButton?: boolean;
  actions?: React.ReactNode[];
  labelSearch?: string;
  variants?: Variants[];
  filterGroup?: {
    label: string;
    name: string;
    type: "text" | "date" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
  defaultValue?: Record<string, unknown>;
  handleDownload?: () => void;
}

const Filter = ({
  actions,
  filterGroup,
  onAdd,
  labelAdd = "Tambah Produk",
  variants = ["search", "download", "date_range"],
  // withPriode = true,
  withAddButton = false,
  defaultValue,
  labelSearch = "",
  handleDownload
}: FilterProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [moreFilter, setMoreFilter] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm();
  const { setFilter } = useFilter();
  const debounce = useDebounce();

  const handleApply = (data: object) => {
    setFilter(data);
  };

  const searchValue = watch("search_value");
  const start = watch("startDate");
  const end = watch("endDate");

  useEffect(() => {
    debounce({
      cb: () => {
        setFilter({ search_value: searchValue, startDate: start, endDate: end });
      },
    });
  }, [searchValue, start, end, setFilter, debounce]);

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
    }
  }, [defaultValue, reset]);

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            flex: 1,
            width: "100%",
            minWidth: { xs: "100%", sm: "300px", md: "500px" },
          }}
        >
          <Controller
            control={control}
            name="search_value"
            render={({ field }) => (
              <TextField
                value={field.value || ""}
                onChange={field.onChange}
                variant="outlined"
                placeholder={`Cari ${labelSearch}`}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: <SearchOutlined color="disabled" />,
                  },
                }}
                sx={{
                  backgroundColor: "white",
                }}
              />
            )}
          />
          {variants.includes("download") ? (
            <Button
              variant="text"
              sx={{
                padding: { xs: "4px 8px", sm: "4px 23px" },
              }}
              onClick={handleDownload}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "rgba(36, 174, 95, 0.12)",
                    padding: "4px",
                    borderRadius: "8px",
                    width: "32px",
                    height: "32px",
                  }}
                >
                  <FileDownloadOutlined
                    sx={{
                      color: "#24AE5F",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                    display: { xs: "none", sm: "block" }
                  }}
                >
                  Excel
                </Typography>
              </Stack>
            </Button>
          ) : null}
        </Stack>

        {variants.includes("date_range") ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Box sx={{ flex: 1 }}>
              <FormDateField
                control={control}
                name="startDate"
                format="YYYY-MM-DD"
                placeholder="Dari Tanggal"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormDateField
                control={control}
                name="endDate"
                format="YYYY-MM-DD"
                placeholder="Sampai Tanggal"
              />
            </Box>
          </Stack>
        ) : null}

        {withAddButton ? (
          <Button variant="contained" onClick={onAdd} startIcon={<Add />} fullWidth={isMobile}>
            {labelAdd}
          </Button>
        ) : null}
        {actions?.length ? actions.map((item) => item) : null}
      </Stack>
      {filterGroup ? (
        <Collapse in={moreFilter} sx={{ width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: "17px 18px",
            }}
          >
            <form onSubmit={handleSubmit(handleApply)}>
              <Grid container columnSpacing={2} rowSpacing={2}>
                {filterGroup.map((filter) => (
                  <Grid key={filter.name} size={{ xs: 12, md: 4 }}>
                    {filter.type === "text" ? (
                      <FormTextField
                        control={control}
                        name={filter.name}
                        label={filter.label}
                        placeholder={filter.placeholder}
                      />
                    ) : null}

                    {filter.type === "select" ? (
                      <FormDropdownField
                        control={control}
                        name={filter.name}
                        label={filter.label}
                        placeholder={filter.placeholder}
                        options={filter.options || []}
                      />
                    ) : null}

                    {filter.type === "date" ? (
                      <FormDateField control={control} name={filter.name} label="Dibuat pada" />
                    ) : null}
                  </Grid>
                ))}
              </Grid>
              <Stack
                direction="row"
                sx={{
                  marginTop: "16px",
                  justifyContent: "flex-end",
                  gap: "16px",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setMoreFilter(false);
                  }}
                >
                  Batal
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Terapkan Filter
                </Button>
              </Stack>
            </form>
          </Box>
        </Collapse>
      ) : null}

      {/*
      <Popup
        type="warning"
        title="Lanjutkan untuk Mengunduh?"
        open={downloadPopup}
        onClose={() => {
          setDownloadPopup(false);
        }}
        okText="Konfirmasi"
        onOk={() => {
          setDownloadPopup(false);
          handleDownload && handleDownload();
        }}
      />
      */}
    </>
  );
};

export default Filter;
