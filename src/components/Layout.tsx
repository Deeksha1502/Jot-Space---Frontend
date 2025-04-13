import { Box } from '@mui/material';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          ml: '72px', // Width of the collapsed sidebar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 