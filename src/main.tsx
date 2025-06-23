import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Page from './Page.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./index.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'NotoSansThai, sans-serif',
  },
});

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Page />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}