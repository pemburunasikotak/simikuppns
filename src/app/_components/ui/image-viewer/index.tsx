'use client';

import React, { useState } from 'react';
// import Image from 'next/image';
import { Close, ZoomIn, ZoomOut } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';

interface ImageViewerProps {
  image?: string | null;
  height?: number;
  width?: number;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, alt = 'Thumbnail', height = 52, width = 52 }) => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const isValidLink = image && image.startsWith('http');

  if (!image || !isValidLink) return '-';

  return (
    <>
      <img
        src={image}
        alt={alt}
        width={width}
        height={height}
        style={{ cursor: 'pointer', maxWidth: '150px', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }}
        onClick={handleOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        className="test-dialog"
        sx={{
          '.MuiDialog-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '100vh',
          }}
          onClick={handleClose}
        >
          <IconButton
            onClick={handleClose}
            style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}
          >
            <Close />
          </IconButton>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <img
              src={image}
              alt={alt}
              //width={800}
              //height={600}
              style={{
                transform: `scale(${zoom})`,
                maxHeight: '600px',
                maxWidth: '800px',
                transition: 'transform 0.3s',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <IconButton onClick={handleZoomOut} style={{ color: 'white' }}>
              <ZoomOut />
            </IconButton>
            <IconButton onClick={handleZoomIn} style={{ color: 'white' }}>
              <ZoomIn />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer;
