import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Regsiter from './pages/Regsiter';
import Home from './pages/Home';
import Start from './components/Start';
import AuthContainer from './pages/AuthContainer';

function App() {
  return (
    <div className="bg-[#F8F4EA]">
      <Router>
        <Routes>
          <Route exact path="/login" element={<AuthContainer />} />
          <Route exact path="/register" element={<AuthContainer />} />
          <Route exact path="/chats" element={<Home />} />
          <Route exact path="/" element={<Start />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
