import React from 'react';
import { Box, Fade, Paper, IconButton, Typography, ButtonGroup, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IDeleteBranchModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteBranchModal = ({
  isOpen,
  onClose,
  onConfirm,
}: IDeleteBranchModal) => {
  return (
    <Fade in={isOpen}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor:'default'
        }}
        onClick={onClose} // Close modal when clicking outside
      >
        <Paper
          elevation={3}
          sx={{
            width: '400px', // Smaller width
            height: '200px', // Smaller height
            backgroundColor: '#36393f',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'red',
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Confirmation Message */}
          <Typography variant="h6" color="white" sx={{ mb: 3, textAlign: 'center' }}>
            Are you sure you want to delete this branch?
          </Typography>

          {/* Button Group */}
          <ButtonGroup>
            
            <Button
              onClick={onClose}
              variant='contained'
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#a72424', borderColor:'transparent' },
                
              }}
            >
              No
            </Button>

            <Button
              onClick={onConfirm}
              sx={{
                backgroundColor: '#7289da',
                color: 'white',
                '&:hover': { backgroundColor: '#5b6eae', borderColor:'transparent' },
                mr: 2, // Add margin between buttons
              }}
            >
              Yes
            </Button>
            
          </ButtonGroup>
        </Paper>
      </Box>
    </Fade>
  );
};