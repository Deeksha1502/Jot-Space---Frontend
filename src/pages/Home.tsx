import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from '../components/SearchBar';
import { useEntries } from '../hooks/useEntries';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ThemeContext } from '../App';
import { getWordStats, WordStats } from '../utils/wordCount';

interface Entry {
  id: number;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  stats?: WordStats;
}

interface SearchFilters {
  title: string;
  content: string;
  tags: string;
  startDate: string;
  endDate: string;
}

interface EntryStats extends Entry {
  stats: WordStats;
}

const Home = () => {
  const navigate = useNavigate();
  const { entries: rawEntries, setEntries, loading, error, setError } = useEntries();
  const [entries, setLocalEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (rawEntries) {
      const entriesWithStats = rawEntries.map(entry => ({
        ...entry,
        stats: getWordStats(entry.content)
      }));
      setLocalEntries(entriesWithStats);
      setFilteredEntries(entriesWithStats);
    }
  }, [rawEntries]);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...entries];

    if (filters.title) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.content) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    if (filters.tags) {
      const searchTags = filters.tags.toLowerCase().split(',').map(tag => tag.trim());
      filtered = filtered.filter(entry => {
        const entryTags = entry.tags.toLowerCase().split(',').map(tag => tag.trim());
        return searchTags.some(searchTag => entryTags.includes(searchTag));
      });
    }

    if (filters.startDate) {
      filtered = filtered.filter(entry =>
        new Date(entry.created_at) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(entry =>
        new Date(entry.created_at) <= new Date(filters.endDate)
      );
    }

    setFilteredEntries(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, entry: Entry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedEntry) {
      navigate(`/edit/${selectedEntry.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedEntry) {
      try {
        const response = await fetch(`http://localhost:8000/api/entries/${selectedEntry.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const updatedEntries = entries.filter(entry => entry.id !== selectedEntry.id);
          setEntries(updatedEntries);
          setFilteredEntries(filteredEntries.filter(entry => entry.id !== selectedEntry.id));
        } else {
          throw new Error('Failed to delete entry');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        setError('Failed to delete entry. Please try again.');
      }
    }
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleTitleClick = () => {
    setLocalEntries([]);
    setFilteredEntries([]);
    navigate('/');
  };

  const handleCardClick = (entry: Entry, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.MuiIconButton-root')) {
      return;
    }
    setSelectedEntry(entry);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedEntry(null);
  };

  const getTotalStats = () => {
    return filteredEntries.reduce((acc, entry) => ({
      wordCount: acc.wordCount + (entry.stats?.wordCount || 0),
      characterCount: acc.characterCount + (entry.stats?.characterCount || 0),
      averageWordLength: 0
    }), { wordCount: 0, characterCount: 0, averageWordLength: 0 });
  };

  const getAverageWordLength = () => {
    const totalStats = getTotalStats();
    return totalStats.wordCount > 0 
      ? Math.round((totalStats.characterCount / totalStats.wordCount) * 10) / 10 
      : 0;
  };

  const getAverageWordsPerEntry = () => {
    const totalStats = getTotalStats();
    return filteredEntries.length > 0 
      ? Math.round(totalStats.wordCount / filteredEntries.length) 
      : 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: darkMode ? '#121212' : '#ffffff',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease',
      mt: 0,
      pt: 0
    }}>
      <Container maxWidth={false} disableGutters sx={{ pt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          position: 'relative'
        }}>
          <Typography 
            variant="h4" 
            onClick={handleTitleClick}
            sx={{ 
              cursor: 'pointer',
              color: darkMode ? '#ffffff' : '#000000'
            }}
          >
            My Diary Entries
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              position: 'relative',
              mr: 2
            }}>
              <SearchBar onSearch={handleSearch} darkMode={darkMode} />
            </Box>
            <Tooltip title="View Statistics">
              <IconButton 
                onClick={() => setStatsDialogOpen(true)}
                sx={{ color: darkMode ? '#ffffff' : '#000000' }}
              >
                <BarChartIcon />
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={() => toggleDarkMode()}
              sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          {filteredEntries.length === 0 ? (
            <Typography sx={{ 
              mt: 2,
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              No entries found.
            </Typography>
          ) : (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}>
              {filteredEntries.map((entry) => (
                <Card 
                  key={entry.id}
                  onClick={(e) => handleCardClick(entry, e)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
                    '& .MuiCardHeader-title': {
                      color: darkMode ? '#ffffff' : '#000000'
                    },
                    '& .MuiCardHeader-subheader': {
                      color: darkMode ? '#aaaaaa' : '#666666'
                    },
                    '& .MuiTypography-root': {
                      color: darkMode ? '#ffffff' : '#000000'
                    }
                  }}
                >
                  <CardHeader
                    title={entry.title}
                    subheader={
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: darkMode ? '#aaaaaa' : 'text.secondary'
                      }}>
                        <Typography variant="body2">
                          {format(new Date(entry.created_at), 'dd/MM/yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          {entry.stats?.wordCount || 0} words
                        </Typography>
                      </Box>
                    }
                    action={
                      <IconButton 
                        onClick={(e) => handleMenuClick(e, entry)}
                        sx={{ color: darkMode ? '#ffffff' : '#000000' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <div 
                      dangerouslySetInnerHTML={{ __html: entry.content }}
                      style={{ color: darkMode ? '#ffffff' : '#000000' }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {entry.tags.split(',').map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag.trim()} 
                          size="small"
                          sx={{
                            bgcolor: darkMode ? '#333333' : '#f0f0f0',
                            color: darkMode ? '#ffffff' : '#000000'
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              '& .MuiMenuItem-root': {
                color: darkMode ? '#ffffff' : '#000000'
              }
            }
          }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this entry?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDeleteCancel}
              sx={{ color: darkMode ? '#ffffff' : 'inherit' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewModalOpen}
          onClose={handleCloseViewModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000'
            }
          }}
        >
          {selectedEntry && (
            <>
              <DialogTitle>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  color: darkMode ? '#ffffff' : '#000000'
                }}>
                  <Typography variant="h5">{selectedEntry.title}</Typography>
                  <Typography variant="subtitle1" color={darkMode ? '#aaaaaa' : 'text.secondary'}>
                    {new Date(selectedEntry.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedEntry.content }}
                    style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedEntry.tags.split(',').map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag.trim()}
                      sx={{
                        bgcolor: darkMode ? '#333333' : '#f0f0f0',
                        color: darkMode ? '#ffffff' : '#000000'
                      }}
                    />
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={handleCloseViewModal}
                  sx={{ color: darkMode ? '#ffffff' : 'inherit' }}
                >
                  Close
                </Button>
                <Button 
                  onClick={handleEdit} 
                  color="primary"
                  sx={{ color: darkMode ? '#90caf9' : 'primary' }}
                >
                  Edit
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={statsDialogOpen}
          onClose={() => setStatsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>Writing Statistics</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>Overall Statistics</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Entries
                  </Typography>
                  <Typography variant="h5">
                    {filteredEntries.length}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Words
                  </Typography>
                  <Typography variant="h5">
                    {getTotalStats().wordCount}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Words per Entry
                  </Typography>
                  <Typography variant="h5">
                    {getAverageWordsPerEntry()}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Word Length
                  </Typography>
                  <Typography variant="h5">
                    {getAverageWordLength()} characters
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Home; 