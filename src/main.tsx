import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './styles.css'

const router = getRouter();

// Redirecionamento de Performance: Se for ferramenta, pula o React e vai pro HTML puro
if (window.location.pathname.includes('/ferramentas/lsp')) {
  window.location.href = '/gerador/index.html';
} else if (window.location.pathname.includes('/ferramentas/sql')) {
  window.location.href = '/gerador/sql.html';
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
