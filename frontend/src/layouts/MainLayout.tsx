import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import AppSidebar from '../components/AppSideBar';
import { Toaster } from '../components/ui/sonner';
const MainLayout = () => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className='flex-1 p-6'>
          <SidebarTrigger />
          <Outlet />
          <Toaster/>
        </main>
    </SidebarProvider>
  
  );
};

export default MainLayout;