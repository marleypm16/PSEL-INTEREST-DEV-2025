import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import AppSidebar from '../components/AppSideBar';
const MainLayout = () => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className='flex-1 p-6'>
          <SidebarTrigger />
          <Outlet />
        </main>
    </SidebarProvider>
  
  );
};

export default MainLayout;