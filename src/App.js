import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Example from './components/Example';
import Landing from './components/Landing';
import NavBar from './components/NavBar';
import Login from './components/Login';

function App() {
  const location = useLocation();

  return (
    <div>
      {/* Render NavBar only if the current route is not '/login' */}
      {location.pathname !== '/' && <NavBar />}
      
      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
