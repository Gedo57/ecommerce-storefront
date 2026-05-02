import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './redux/store';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { LocaleProvider } from './context/LocaleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocaleProvider>
          <CurrencyProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </CurrencyProvider>
        </LocaleProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
