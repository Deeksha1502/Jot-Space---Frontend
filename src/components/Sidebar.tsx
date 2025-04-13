import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Box,
  ListItemButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEntries } from '../hooks/useEntries';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetEntries } = useEntries();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTitleClick = () => {
    resetEntries();
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 72,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          border: 'none',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          position: 'fixed',
          height: '100vh',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'space-between' : 'center'
      }}>
        {open && (
          <Typography 
            variant="h6" 
            onClick={handleTitleClick}
            sx={{ 
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Diary App
          </Typography>
        )}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === '/'}
            sx={{ 
              color: 'white',
              justifyContent: open ? 'flex-start' : 'center',
              px: open ? 2 : 'auto',
            }}
          >
            <ListItemIcon sx={{ 
              color: 'white',
              minWidth: open ? 40 : 'auto',
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Entries" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/new"
            selected={location.pathname === '/new'}
            sx={{ 
              color: 'white',
              justifyContent: open ? 'flex-start' : 'center',
              px: open ? 2 : 'auto',
            }}
          >
            <ListItemIcon sx={{ 
              color: 'white',
              minWidth: open ? 40 : 'auto',
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}>
              <AddIcon />
            </ListItemIcon>
            {open && <ListItemText primary="New Entry" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 