import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL;
const basename = !base || base === '/' ? undefined : base.replace(/\/$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

