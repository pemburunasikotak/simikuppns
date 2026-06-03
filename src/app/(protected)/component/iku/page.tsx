import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Skeleton,
  TextField,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  SearchOutlined,
  TagOutlined,
  SpeedOutlined,
} from "@mui/icons-material";
import { Page } from "@/app/_components/ui";
import useGetListIKU from "./_hooks/use-get-list-iku";

const MOCK_IKUS = [
  {
    id: "iku-1",
    code: "IKU1",
    name: "Kesiapan Lulusan Mendapatkan Pekerjaan",
    description: "Persentase lulusan program diploma dan sarjana yang langsung bekerja, melanjutkan studi, atau berwiraswasta dalam waktu kurang dari satu tahun setelah lulus.",
    tags: [{ name: "Lulusan", color: "#6366f1" }, { name: "Karir", color: "#10b981" }]
  },
  {
    id: "iku-2",
    code: "IKU2",
    name: "Mahasiswa Mendapatkan Pengalaman di Luar Kampus",
    description: "Persentase mahasiswa program diploma dan sarjana yang menghabiskan paling sedikit 20 SKS di luar kampus atau meraih prestasi minimal tingkat nasional.",
    tags: [{ name: "Mahasiswa", color: "#3b82f6" }, { name: "Prestasi", color: "#f59e0b" }]
  },
  {
    id: "iku-3",
    code: "IKU3",
    name: "Dosen Berkegiatan di Luar Kampus",
    description: "Persentase dosen yang berkegiatan tridharma di luar kampus, di industri, atau di perguruan tinggi lain.",
    tags: [{ name: "Dosen", color: "#ec4899" }, { name: "Tridharma", color: "#8b5cf6" }]
  },
  {
    id: "iku-4",
    code: "IKU4",
    name: "Kualifikasi dan Sertifikasi Dosen",
    description: "Persentase dosen berkualifikasi akademik S3, memiliki sertifikat pendidik, sertifikat kompetensi/profesi, atau berasal dari kalangan praktisi.",
    tags: [{ name: "Dosen", color: "#ec4899" }, { name: "Kompetensi", color: "#ef4444" }]
  }
];

const IKUPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading } = useGetListIKU({ limit: 100 });

  const ikuItems = useMemo(() => {
    const list = data?.result?.data || [];
    const baseList = list.length > 0 ? list : MOCK_IKUS;
    
    if (searchQuery.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return baseList.filter((item: any) =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return baseList;
  }, [data, searchQuery]);

  return (
    <Page
      topPage={
        <Box sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Indikator Kinerja Utama (IKU)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Daftar sasaran kinerja utama universitas berdasarkan standar mutu pendidikan tinggi.
          </Typography>
        </Box>
      }
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <TextField
            size="small"
            placeholder="Cari IKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
              },
            }}
          />
        </Box>

        {/* Card Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: "16px" }} />
              </Grid>
            ))}
          </Grid>
        ) : ikuItems.length > 0 ? (
          <Grid container spacing={3}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {ikuItems.map((item: any) => (
              <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.08)",
                      borderColor: alpha("#6366f1", 0.2),
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Chip
                        icon={<SpeedOutlined sx={{ color: "white !important", fontSize: "16px" }} />}
                        label={item.code}
                        sx={{
                          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                          color: "white",
                          fontWeight: 700,
                          borderRadius: "8px",
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {item.name}
                      </Typography>
                    </Stack>
                    
                    <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, mb: 3 }}>
                      {item.description || "Tidak ada rincian deskripsi untuk IKU ini."}
                    </Typography>

                    {item.tags && item.tags.length > 0 && (
                      <Stack direction="row" spacing={1}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {item.tags.map((tag: any, idx: number) => (
                          <Chip
                            key={idx}
                            label={tag.name}
                            size="small"
                            icon={<TagOutlined sx={{ fontSize: "12px !important" }} />}
                            sx={{
                              backgroundColor: alpha(tag.color || "#6366f1", 0.08),
                              color: tag.color || "#6366f1",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Tidak ada IKU yang sesuai dengan pencarian Anda.
            </Typography>
          </Box>
        )}
      </Stack>
    </Page>
  );
};

export default IKUPage;
