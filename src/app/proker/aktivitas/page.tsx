import { FC, ReactElement, useState } from "react";
import { Page } from "@/app/_components/ui";
import { Card, Typography, Box, Button, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useGetAktivitass } from "./_hooks/use-get-list-aktivitas";

const AktivitasPage: FC = (): ReactElement => {
  const [page, setPage] = useState(1);
  console.log('CEK DATA PAGE', setPage)
  const { data, isLoading } = useGetAktivitass({ page, limit: 10 });
  const items = data?.data?.items || [];

  return (
    <Page>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Daftar Aktivitas</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          Tambah Aktivitas
        </Button>
      </Box>

      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField size="small" placeholder="Cari..." />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell width="5%">No</TableCell>
                <TableCell>ID</TableCell>
                <TableCell align="center" width="15%">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
              ) : items.length > 0 ? (
                items.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small"><Edit /></IconButton>
                      <IconButton color="error" size="small"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">Data kosong</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Page>
  );
};

export default AktivitasPage;
