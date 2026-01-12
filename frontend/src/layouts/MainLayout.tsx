import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar/SideBar';

const MainLayout = () => {


  return (

      <div className="app-layout">
        <SideBar/>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;