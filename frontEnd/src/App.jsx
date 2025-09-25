import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className='bg-[url("./src/assets/bg.jpg")] bg-contain w-full'>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;
