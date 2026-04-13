import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './views/Home.jsx';
import {Routes, Route, BrowserRouter} from 'react-router';
import Login from './views/Login.jsx';
import Signup from './views/Signup.jsx';

createRoot(document.getElementById('root')).render(
    <App />
)
