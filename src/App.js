import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Example from './components/Example';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Iteminfo from './components/Iteminfo';
import Userinfo from './components/Userinfo';
import Addnewproduct from './components/Addnewproduct';
import EditProductDialog from './components/EditProductDialog';

function App() {
  const location = useLocation();

  return (
    <div>
      {/* Render NavBar only if the current route is not '/login' */}
      {location.pathname !== '/' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/iteminfo/:id" element={<Iteminfo />} />
        <Route path="/userinfo" element={<Userinfo />} />
        <Route path="/addnewproduct" element={<Addnewproduct />} />
        <Route path="/edit" element={<EditProductDialog />} />
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
