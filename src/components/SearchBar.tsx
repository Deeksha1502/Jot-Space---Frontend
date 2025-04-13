import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface SearchFilters {
  title: string;
  content: string;
  tags: string;
  startDate: string;
  endDate: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  darkMode?: boolean;
}

export default function SearchBar({ onSearch, darkMode = false }: SearchBarProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    title: '',
    content: '',
    tags: '',
    startDate: '',
    endDate: '',
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    onSearch(filters);
    handleClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(filters);
    }
  };

  const handleReset = () => {
    setFilters({
      title: '',
      content: '',
      tags: '',
      startDate: '',
      endDate: '',
    });
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ 
      width: '300px',
      position: 'relative'
    }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search entries..."
        value={filters.title}
        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        onKeyPress={handleKeyPress}
        sx={{
          width: '300px',
          '& .MuiOutlinedInput-root': {
            width: '300px',
            backgroundColor: darkMode ? '#333333' : '#ffffff',
            '&:hover': {
              backgroundColor: darkMode ? '#404040' : '#f5f5f5'
            },
            '& fieldset': {
              borderColor: darkMode ? '#555555' : 'rgba(0, 0, 0, 0.23)'
            }
          },
          '& .MuiInputBase-input': {
            width: '220px',
            color: darkMode ? '#ffffff' : '#000000',
            '&::placeholder': {
              color: darkMode ? '#aaaaaa' : 'rgba(0, 0, 0, 0.6)',
              opacity: 1
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <Box sx={{ 
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '4px',
              backgroundColor: 'transparent'
            }}>
              <IconButton 
                onClick={handleClick} 
                size="small"
                sx={{ 
                  padding: '4px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
              <IconButton 
                onClick={() => onSearch(filters)} 
                size="small"
                sx={{ 
                  padding: '4px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          }
        }}
      >
        <Paper sx={{ 
          p: 3, 
          width: 300,
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              color: darkMode ? '#ffffff' : '#000000'
            }}
          >
            Advanced Search
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Content"
              fullWidth
              value={filters.content}
              onChange={(e) => setFilters({ ...filters, content: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333333' : '#ffffff',
                  '& fieldset': {
                    borderColor: darkMode ? '#555555' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#ffffff' : '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaaaaa' : 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <TextField
              label="Tags"
              fullWidth
              value={filters.tags}
              onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333333' : '#ffffff',
                  '& fieldset': {
                    borderColor: darkMode ? '#555555' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#ffffff' : '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaaaaa' : 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333333' : '#ffffff',
                  '& fieldset': {
                    borderColor: darkMode ? '#555555' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#ffffff' : '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaaaaa' : 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#333333' : '#ffffff',
                  '& fieldset': {
                    borderColor: darkMode ? '#555555' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#ffffff' : '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaaaaa' : 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button 
                onClick={handleReset} 
                sx={{ 
                  color: darkMode ? '#ffffff' : 'inherit'
                }}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSearch} 
                variant="contained"
              >
                Search
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Popover>
    </Box>
  );
} 