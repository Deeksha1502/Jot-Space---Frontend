import { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill.css';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import { ThemeContext } from '../App';
import { useEntries } from '../hooks/useEntries';

const NewEntry = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { setEntries } = useEntries();

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
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Remove empty paragraph tags that ReactQuill adds
    const cleanContent = content.replace(/<p><br><\/p>/g, '').trim();
    
    // Don't submit if there's no real content
    if (!title.trim() || !cleanContent) {
      setLoading(false);
      return;
    }

    const entryData = {
      title: title.trim(),
      content: cleanContent,
      tags: (tags || '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).join(',')

    
    };

    try {
      const response = await fetch('http://localhost:8000/api/entries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(entryData)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Refresh entries list and navigate home
        const entriesResponse = await fetch('http://localhost:8000/api/entries/');
        const entries = await entriesResponse.json();
        setEntries(entries);
        navigate('/');
      } else {
        console.error('Server response:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
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

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        bgcolor: '#ffffff',
        minHeight: '100vh',
        pt: 2
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
            color: '#000000'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
            New Entry
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={tags}
              onChange={handleTagsChange}
              margin="normal"
              variant="outlined"
              placeholder="e.g., work, personal, goals"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputBase-input': {
                  color: '#000000'
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
            <Box sx={{ mt: 3, mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                Content
              </Typography>
              <div className="quill-wrapper">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
              </div>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.87)',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  minWidth: '120px',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Entry'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Container>
  );
};

export default NewEntry; 