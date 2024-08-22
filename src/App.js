import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Example from './components/Example';
import Landing from './components/Landing';
import Login from './components/Login';

function App() {

  return (
    <div>
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
