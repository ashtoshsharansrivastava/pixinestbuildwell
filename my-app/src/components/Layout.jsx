// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// 2. Remove the {children} prop
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-skin-base text-white" >
      <Header />
      <main className="flex-1 pt-16 px-6 md:px-10 lg:px-10">
        {/* 3. Replace {children} with <Outlet /> */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}