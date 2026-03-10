import { FC, ReactNode } from "react";
import { Card, Box, Typography, Stack } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface SummaryCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    iconBgColor: string;
    trendValue: string;
    isUp?: boolean;
}

const SummaryCard: FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    iconBgColor,
    trendValue,
    isUp = true,
}) => {
    return (
        <Card sx={{ padding: 2, borderRadius: 2, height: "100%", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: iconBgColor,
                            borderRadius: "8px",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                        {title}
                    </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </Stack>
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.100" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {isUp ? (
                        <TrendingUp sx={{ color: "success.main", fontSize: "1rem" }} />
                    ) : (
                        <TrendingDown sx={{ color: "error.main", fontSize: "1rem" }} />
                    )}
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: "bold", color: isUp ? "success.main" : "error.main" }}
                    >
                        {trendValue}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Bulan Lalu
                    </Typography>
                </Stack>
            </Box>
        </Card>
    );
};

export default SummaryCard;
