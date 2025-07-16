import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/reset.scss';
import './styles/global.scss';
import './i18n';
import "react-big-calendar/lib/css/react-big-calendar.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
