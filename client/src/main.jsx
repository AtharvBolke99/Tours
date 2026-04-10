import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './views/Home.jsx';
import {Routes, Route, BrowserRouter} from 'react-router';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
    </Routes>
    </BrowserRouter>
)
