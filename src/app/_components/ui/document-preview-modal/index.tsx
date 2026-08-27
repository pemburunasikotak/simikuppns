import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  CloseOutlined,
  DownloadOutlined,
  OpenInNewOutlined,
  DescriptionOutlined,
  InsertDriveFileOutlined,
  PictureAsPdfOutlined,
  ImageOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RestartAltOutlined,
} from "@mui/icons-material";
import { env } from "@/libs/env";
import prokerAxiosInstance from "@/libs/axios/proker-config";

export type TDocumentItem = {
  title?: string;
  name?: string;
  url?: string;
  id?: string;
  file?: File;
  raw?: unknown;
  label?: string;
};

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  documents?: (string | File | TDocumentItem | unknown)[];
  document?: string | File | TDocumentItem | unknown;
  initialIndex?: number;
}

const getFileUrl = (doc: unknown): string => {
  if (!doc) return "";
  if (doc instanceof File) {
    return URL.createObjectURL(doc);
  }
  if (typeof doc === "string") {
    if (
      doc.startsWith("http://") ||
      doc.startsWith("https://") ||
      doc.startsWith("blob:") ||
      doc.startsWith("data:")
    ) {
      return doc;
    }
    if (doc.startsWith("/")) {
      return `${env.VITE_PROKER_API_BASE_URL}${doc}`;
    }
    return `${env.VITE_PROKER_API_BASE_URL}/api/v1/documents/${doc}`;
  }
  if (typeof doc === "object" && doc !== null) {
    const obj = doc as Record<string, unknown>;
    const target =
      obj.proposalURL ||
      obj.rabURL ||
      obj.url ||
      obj.filePath ||
      obj.fileUrl ||
      obj.path ||
      (typeof obj.proposalDocument === "object" && obj.proposalDocument ? getFileUrl(obj.proposalDocument) : "") ||
      (typeof obj.rabDocument === "object" && obj.rabDocument ? getFileUrl(obj.rabDocument) : "") ||
      obj.id ||
      obj._id;
    if (target && typeof target === "string") return getFileUrl(target);
  }
  return "";
};

const getFileName = (doc: unknown, fallbackTitle = "Dokumen"): string => {
  if (!doc) return fallbackTitle;
  if (doc instanceof File) return doc.name;
  if (typeof doc === "object" && doc !== null) {
    const obj = doc as Record<string, unknown>;
    if (obj.fileName && typeof obj.fileName === "string") return obj.fileName;
    if (obj.name && typeof obj.name === "string") return obj.name;
    if (obj.title && typeof obj.title === "string") return obj.title;
    if (obj.filename && typeof obj.filename === "string") return obj.filename;
    if (obj.proposalDocument && typeof obj.proposalDocument === "object") {
      const name = getFileName(obj.proposalDocument, "");
      if (name) return name;
    }
    if (obj.rabDocument && typeof obj.rabDocument === "object") {
      const name = getFileName(obj.rabDocument, "");
      if (name) return name;
    }
  }
  const url = getFileUrl(doc);
  if (url) {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const parts = cleanUrl.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.includes(".")) {
      return decodeURIComponent(lastPart);
    }
  }
  return fallbackTitle;
};

const getFileType = (url: string, fileName: string, doc?: unknown): "image" | "pdf" | "office" | "other" => {
  if (typeof doc === "object" && doc !== null) {
    const obj = doc as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mime = (obj.mimeType || (obj.proposalDocument as any)?.mimeType || (obj.rabDocument as any)?.mimeType || "") as string;
    if (mime.startsWith("image/")) return "image";
    if (mime.includes("pdf")) return "pdf";
    if (mime.includes("officedocument") || mime.includes("word") || mime.includes("excel") || mime.includes("spreadsheet")) return "office";
  }

  const targetStr = (fileName || url || "").toLowerCase();
  if (targetStr.match(/\.(jpeg|jpg|png|gif|webp|svg)($|\?)/i) || url.startsWith("data:image")) {
    return "image";
  }
  if (targetStr.match(/\.pdf($|\?)/i) || url.includes("/pdf") || url.startsWith("data:application/pdf")) {
    return "pdf";
  }
  if (targetStr.match(/\.(doc|docx|xls|xlsx|ppt|pptx)($|\?)/i)) {
    return "office";
  }
  return "other";
};

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onClose,
  title = "Pratinjau Dokumen",
  documents,
  document: docProp,
  initialIndex = 0,
}) => {
  const docList = useMemo(() => {
    let items: unknown[] = [];
    if (documents && Array.isArray(documents)) {
      items = documents.filter(Boolean);
    } else if (docProp) {
      items = [docProp];
    }
    return items;
  }, [documents, docProp]);

  const [activeTab, setActiveTab] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [detectedMime, setDetectedMime] = useState<string>("");

  useEffect(() => {
    if (open) {
      setActiveTab(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  const currentDoc = docList[activeTab] || docList[0];
  const fileUrl = getFileUrl(currentDoc);
  const fileName = getFileName(currentDoc, `Dokumen ${activeTab + 1}`);
  const initialFileType = getFileType(fileUrl, fileName);

  useEffect(() => {
    let isMounted = true;
    let createdBlobUrl = "";

    const fetchDocument = async () => {
      if (!open || !currentDoc) return;

      const rawUrl = getFileUrl(currentDoc);
      if (!rawUrl) return;

      if (rawUrl.startsWith("blob:") || rawUrl.startsWith("data:")) {
        setPreviewSrc(rawUrl);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await prokerAxiosInstance.get(rawUrl, {
          responseType: "blob",
        });
        if (!isMounted) return;

        const blob = response.data as Blob;
        const contentType = blob.type || "";
        setDetectedMime(contentType);

        createdBlobUrl = URL.createObjectURL(blob);
        setPreviewSrc(createdBlobUrl);
      } catch (err) {
        console.warn("Could not fetch document as blob, fallback to direct URL", err);
        if (isMounted) {
          setPreviewSrc(rawUrl);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDocument();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [open, currentDoc]);

  if (!open || docList.length === 0) return null;

  const isImage =
    detectedMime.startsWith("image/") ||
    initialFileType === "image" ||
    previewSrc.startsWith("data:image");

  const isPdf =
    detectedMime.includes("pdf") ||
    initialFileType === "pdf" ||
    previewSrc.startsWith("data:application/pdf");

  const displayType = isImage ? "image" : isPdf ? "pdf" : "document";

  const handleDownload = () => {
    const targetUrl = previewSrc || fileUrl;
    if (!targetUrl) return;
    const a = document.createElement("a");
    a.href = targetUrl;
    a.target = "_blank";
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenNewTab = () => {
    const targetUrl = previewSrc || fileUrl;
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ overflow: "hidden" }}>
          {isPdf ? (
            <PictureAsPdfOutlined color="error" />
          ) : isImage ? (
            <ImageOutlined color="primary" />
          ) : (
            <DescriptionOutlined color="success" />
          )}
          <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: 450 }}>
            {title}: {fileName}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Buka di Tab Baru">
            <IconButton size="small" onClick={handleOpenNewTab} color="primary">
              <OpenInNewOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unduh File">
            <IconButton size="small" onClick={handleDownload} color="primary">
              <DownloadOutlined />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={onClose} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>

      {docList.length > 1 && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setZoom(1);
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {docList.map((item, idx) => (
              <Tab
                key={idx}
                label={getFileName(item, `Dokumen ${idx + 1}`)}
                sx={{ fontWeight: 600, textTransform: "none" }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      <DialogContent
        sx={{
          p: 2,
          minHeight: 480,
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isImage ? "grey.900" : "grey.100",
          position: "relative",
          overflow: "auto",
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress color="primary" size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={600}>
              Memuat berkas dokumen...
            </Typography>
          </Box>
        ) : !previewSrc ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <InsertDriveFileOutlined sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Dokumen tidak dapat dimuat atau link tidak valid.
            </Typography>
          </Box>
        ) : isImage ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                bgcolor: "rgba(0,0,0,0.65)",
                borderRadius: 2,
                p: 0.5,
              }}
            >
              <Tooltip title="Perbesar">
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
                >
                  <ZoomInOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Perkecil">
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                >
                  <ZoomOutOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset Zoom">
                <IconButton size="small" sx={{ color: "white" }} onClick={() => setZoom(1)}>
                  <RestartAltOutlined />
                </IconButton>
              </Tooltip>
            </Stack>

            <img
              src={previewSrc}
              alt={fileName}
              style={{
                maxWidth: "100%",
                maxHeight: "65vh",
                objectFit: "contain",
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease-in-out",
                borderRadius: 4,
              }}
            />
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: 580, display: "flex", flexDirection: "column" }}>
            <iframe
              src={previewSrc}
              title={fileName}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "8px", backgroundColor: "#ffffff" }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, bgcolor: "grey.50", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Tipe Berkas: {displayType.toUpperCase()} {detectedMime ? `(${detectedMime})` : ""}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadOutlined />}
            onClick={handleDownload}
            sx={{ fontWeight: 600 }}
          >
            Unduh
          </Button>
          <Button variant="contained" size="small" onClick={onClose} sx={{ fontWeight: 600 }}>
            Tutup
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export type TDocumentCellItem = {
  label?: string;
  doc: unknown;
};

interface DocumentCellProps {
  documents?: (unknown | TDocumentCellItem)[];
  document?: unknown;
  title?: string;
  maxItems?: number;
}

export const DocumentCell: React.FC<DocumentCellProps> = ({
  documents,
  document: docProp,
  title = "Pratinjau Dokumen",
  maxItems = 3,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const docList = useMemo(() => {
    let rawItems: unknown[] = [];
    if (documents && Array.isArray(documents)) {
      rawItems = documents.filter(Boolean);
    } else if (docProp) {
      rawItems = [docProp];
    }
    return rawItems.map((item) => {
      if (typeof item === "object" && item !== null && "doc" in item) {
        const cellItem = item as TDocumentCellItem;
        return {
          doc: cellItem.doc,
          label: cellItem.label || getFileName(cellItem.doc),
        };
      }
      return {
        doc: item,
        label: getFileName(item),
      };
    });
  }, [documents, docProp]);

  if (docList.length === 0) return <>-</>;

  const visibleDocs = docList.slice(0, maxItems);
  const hiddenCount = docList.length - maxItems;

  const handleOpenPreview = (idx: number) => {
    setSelectedIndex(idx);
    setModalOpen(true);
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%", py: 0.5 }}>
        {visibleDocs.map((item, idx) => {
          const url = getFileUrl(item.doc);
          const name = getFileName(item.doc, item.label);
          const type = getFileType(url, name);

          if (type === "image" && url) {
            return (
              <Tooltip key={idx} title={`Lihat ${name}`}>
                <Box
                  onClick={() => handleOpenPreview(idx)}
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "grey.300",
                    cursor: "pointer",
                    boxShadow: 1,
                    transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.08)",
                      boxShadow: 3,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <img
                    src={url}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Tooltip>
            );
          }

          if (type === "pdf") {
            return (
              <Tooltip key={idx} title={`Lihat ${name}`}>
                <Box
                  onClick={() => handleOpenPreview(idx)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: "6px",
                    border: "1px solid #fca5a5",
                    bgcolor: "rgba(254, 226, 226, 0.7)",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    "&:hover": {
                      bgcolor: "#fee2e2",
                      borderColor: "#f87171",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <PictureAsPdfOutlined sx={{ fontSize: 18, color: "#dc2626" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#991b1b",
                      maxWidth: 80,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.label || "PDF"}
                  </Typography>
                </Box>
              </Tooltip>
            );
          }

          if (type === "office") {
            return (
              <Tooltip key={idx} title={`Lihat ${name}`}>
                <Box
                  onClick={() => handleOpenPreview(idx)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: "6px",
                    border: "1px solid #a7f3d0",
                    bgcolor: "rgba(209, 250, 229, 0.7)",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    "&:hover": {
                      bgcolor: "#d1fae5",
                      borderColor: "#34d399",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <DescriptionOutlined sx={{ fontSize: 18, color: "#16a34a" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#065f46",
                      maxWidth: 80,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.label || "DOC"}
                  </Typography>
                </Box>
              </Tooltip>
            );
          }

          return (
            <Tooltip key={idx} title={`Lihat ${name}`}>
              <Box
                onClick={() => handleOpenPreview(idx)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "grey.100",
                  cursor: "pointer",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    bgcolor: "grey.200",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <InsertDriveFileOutlined sx={{ fontSize: 18, color: "#475569" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    maxWidth: 80,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.label || "File"}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}

        {hiddenCount > 0 && (
          <Tooltip title={`+${hiddenCount} dokumen lainnya`}>
            <Chip
              label={`+${hiddenCount}`}
              size="small"
              onClick={() => handleOpenPreview(maxItems)}
              sx={{ fontWeight: 700, cursor: "pointer", height: 26 }}
            />
          </Tooltip>
        )}
      </Stack>

      <DocumentPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        documents={docList.map((d) => d.doc)}
        initialIndex={selectedIndex}
      />
    </>
  );
};

export default DocumentPreviewModal;
