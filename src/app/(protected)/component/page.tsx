import { FC, ReactElement } from "react";
import { generatePath, useNavigate } from "react-router";
import { Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";

import { paths } from "@/commons/constants/paths";
import { TGetMetricsParams, TMetricItem } from "@/api/master/metrics/type";
import useGetInfiniteMetrics from "./_hooks/use-get-infinite-metrics";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Chip,
  Box,
  Typography,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  alpha,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { EditOutlined, VisibilityOutlined, TagOutlined, AnalyticsOutlined } from "@mui/icons-material";

const ComponentRealizationPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters } = useFilter<TGetMetricsParams & { search_value?: string }>();

  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteMetrics({
    limit: 12,
    name: filters.search_value,
    tag: filters.tag,
  });

  const metrics = useMemo(() => {
    return data?.pages.flatMap((page) => page?.result?.data || []) || [];
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const MetricCard = ({ item }: { item: TMetricItem }) => (
    <Card
      onClick={() =>
        navigate(
          generatePath(paths.component.view, {
            type: item.type.toLowerCase(),
            id: String(item.id),
          }),
        )
      }
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        cursor: "pointer",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.15)",
          "& .action-buttons": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -12,
          left: 20,
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          zIndex: 1,
        }}
      >
        {item.code}
      </Box>

      <Box
        className="action-buttons"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1,
          opacity: 0,
          transform: "translateX(10px)",
          transition: "all 0.3s ease",
          zIndex: 2,
        }}
      >
        <Tooltip title="Detail">
          <IconButton
            size="small"
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <VisibilityOutlined fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
            onClick={() =>
              navigate(
                generatePath(paths.component.edit, {
                  id: String(item.id),
                }),
              )
            }
          >
            <EditOutlined fontSize="small" color="info" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ pt: 4, flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.3,
            minHeight: "2.6em",
          }}
        >
          {item.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.875rem",
          }}
        >
          {item.description || "No description available"}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: "6px" }}>
          <Chip
            label={item.type}
            size="small"
            icon={<AnalyticsOutlined sx={{ fontSize: "14px !important" }} />}
            sx={{
              backgroundColor: alpha("#6366f1", 0.1),
              color: "#6366f1",
              fontWeight: 600,
              border: "none",
            }}
          />
          <Chip
            label={item.periodType}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.75rem",
              height: "24px",
              color: "#64748b",
              borderColor: "rgba(0,0,0,0.1)",
            }}
          />
        </Stack>

        {item.ikus && item.ikus.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", display: "block", mb: 0.5 }}>
              TERKAIT IKU:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {item.ikus.map((iku) => (
                <Chip
                  key={iku.id}
                  label={iku.code}
                  size="small"
                  sx={{
                    height: "18px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    backgroundColor: alpha("#0f172a", 0.05),
                    color: "#0f172a",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
        {item.tags?.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: "4px" }}>
            {item.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
                icon={<TagOutlined sx={{ fontSize: "12px !important" }} />}
                sx={{
                  fontSize: "0.65rem",
                  height: "20px",
                  borderColor: alpha(tag.color || "#000", 0.1),
                  backgroundColor: alpha(tag.color || "#000", 0.05),
                  color: tag.color || "#64748b",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      {item.ikus?.length > 0 && (
        <Box
          sx={{
            p: 2,
            pt: 1,
            borderTop: "1px dashed rgba(0,0,0,0.08)",
            backgroundColor: "rgba(0,0,0,0.01)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 0.5 }}>
            TARGET IKU:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.ikus.slice(0, 2).map((iku) => (
              <Typography
                key={iku.id}
                variant="caption"
                sx={{
                  backgroundColor: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  color: "#475569",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {iku.code}
              </Typography>
            ))}
            {item.ikus.length > 2 && (
              <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.65rem" }}>
                +{item.ikus.length - 2} more
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Card>
  );

  return (
    <Page
      // breadcrumbs={[
      //   {
      //     label: "Realisasi Komponen",
      //     path: null,
      //   },
      // ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Komponen..."}
          defaultValue={{
            search_value: filters.search_value,
            tag: filters.tag,
          }}
          filterGroup={[
            {
              name: "tag",
              label: "Tag",
              type: "text",
              placeholder: "Filter berdasarkan tag...",
            },
          ]}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.component.create)}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
              }}
            >
              Tambah Komponen
            </Button>,
          ]}
        />
      }
    >
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={250}
                  sx={{ borderRadius: "16px" }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={3}>
              {metrics.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                  <MetricCard item={item} />
                </Grid>
              ))}
            </Grid>

            {/* Intersection Observer Target */}
            <Box
              ref={ref}
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 4,
                mt: 2,
                visibility: hasNextPage ? "visible" : "hidden",
              }}
            >
              {isFetchingNextPage && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Memuat data selanjutnya...
                  </Typography>
                </Stack>
              )}
            </Box>
          </>
        )}
      </Box>
    </Page>
  );
};

export default ComponentRealizationPage;
