import './App.css'
import React from 'react'
import { BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import Navbar from './Componenets/Navbar/Navbar'
import Home from './Pages/Home/Home'
import Authenticate from './Pages/Authenticate/Authenticate'
import Activate from './Pages/Activate/Activate';
import Rooms from './Pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './Componenets/Loader/Loader';
import Room from './Pages/Room/Room';

export default function App() {
//to handle the case when use has completed the /activation but by mistake clicked refersh so to store the previously acquire data we'll use custom hooks
const { loading } = useLoadingWithRefresh();
  return loading ? (
    <Loader message='Loading Please Wait'></Loader>
    ) : (      
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<GuestRoute> <Home></Home> </GuestRoute>}> </Route>
          <Route path="/authenticate" element={<GuestRoute> <Authenticate></Authenticate> </GuestRoute>}> 
          </Route>
          {/*After the user has verified using otp(phone/email) /authentication goes to /activate - isAuth is changed to true */}
          <Route path="/activate" element={ <SemiProtectedRoute> <Activate></Activate></SemiProtectedRoute> }>
          </Route>
          {/*After the /activate is done activated is changed to true and we are redirected to /rooms */}
          <Route path='/rooms' element={<ProtectedRoute> <Rooms></Rooms> </ProtectedRoute>}>
          </Route>
          <Route path='/room/:id' element={<ProtectedRoute> <Room></Room> </ProtectedRoute>}>
          </Route>
        </Routes>
      </BrowserRouter>
  )
}


const GuestRoute = ({children}) => {
  const {isAuth} = useSelector((state) => state.auth);
  return isAuth ? <Navigate to='/rooms'></Navigate> : children;
}

const SemiProtectedRoute = ({children}) => {
  const {isAuth,user} = useSelector((state) => state.auth);
  return (
    !isAuth ? (<Navigate to='/'></Navigate>) : !user.activated ? (children) : (<Navigate to='/rooms'></Navigate>)
  );
}

const ProtectedRoute = ({children}) =>{
  const {isAuth,user} = useSelector((state) => state.auth);
  return (
    !isAuth ? (<Navigate to='/'></Navigate>) : !user.activated ? (<Navigate to='/activate'></Navigate>) :(children)
  );  
};