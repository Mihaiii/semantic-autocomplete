import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SortedOptionsProvider } from './context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SortedOptionsProvider>
      <App />
    </SortedOptionsProvider>
  </React.StrictMode>
)