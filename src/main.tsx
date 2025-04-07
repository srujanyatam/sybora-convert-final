
import { createRoot } from 'react-dom/client'
import { Navigate } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element");
}
