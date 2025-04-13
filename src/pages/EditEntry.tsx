import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill.css';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeContext } from '../App';

interface Entry {
  id: number;
  title: string;
  content: string;
  tags: string;
}

const EditEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  useEffect(() => {
    // Add tooltips to toolbar buttons
    const buttons = document.querySelectorAll('.ql-toolbar button, .ql-toolbar .ql-picker');
    
    const tooltips = {
      'ql-bold': 'Bold',
      'ql-italic': 'Italic',
      'ql-underline': 'Underline',
      'ql-strike': 'Strikethrough',
      'ql-blockquote': 'Blockquote',
      'ql-header': 'Heading style',
      'ql-list[value="ordered"]': 'Numbered list',
      'ql-list[value="bullet"]': 'Bullet list',
      'ql-script[value="sub"]': 'Subscript',
      'ql-script[value="super"]': 'Superscript',
      'ql-indent[value="-1"]': 'Decrease indent',
      'ql-indent[value="+1"]': 'Increase indent',
      'ql-direction': 'Text direction',
      'ql-size': 'Font size',
      'ql-color': 'Text color',
      'ql-background': 'Background color',
      'ql-font': 'Font family',
      'ql-align': 'Text align',
      'ql-link': 'Insert link',
      'ql-image': 'Insert image',
      'ql-video': 'Insert video',
      'ql-clean': 'Clear formatting'
    };

    buttons.forEach(button => {
      for (const [className, tooltip] of Object.entries(tooltips)) {
        if (button.matches(`.${className.split('[')[0]}`)) {
          button.setAttribute('data-tooltip', tooltip);
        }
      }
    });
  }, [entry?.content]);

  const fetchEntry = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/entries/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setEntry(data);
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/entries/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Failed to update entry');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'script',
    'direction',
    'size',
    'color', 'background',
    'font',
    'align'
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!entry) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Entry not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: darkMode ? '#121212' : '#ffffff',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: 4,
          gap: 2
        }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ color: darkMode ? '#ffffff' : '#000000' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ color: darkMode ? '#ffffff' : '#000000' }}
          >
            Edit Diary Entry
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ 
          p: 4,
          bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={entry.title}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              required
              margin="normal"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
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

            <div className="quill-wrapper">
              <ReactQuill
                value={entry?.content || ''}
                onChange={(content) => setEntry(entry ? { ...entry, content } : null)}
                modules={modules}
                formats={formats}
                theme="snow"
              />
            </div>

            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={entry.tags}
              onChange={(e) => setEntry({ ...entry, tags: e.target.value })}
              margin="normal"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
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

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => navigate('/')}
                sx={{ 
                  color: darkMode ? '#ffffff' : 'inherit',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={saving}
                sx={{
                  bgcolor: darkMode ? '#90caf9' : 'primary',
                  '&:hover': {
                    bgcolor: darkMode ? '#42a5f5' : 'primary.dark'
                  }
                }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditEntry; 