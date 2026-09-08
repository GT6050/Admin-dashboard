import React from 'react';
import NavBar from '../components/layout/NavBar';
import SideBar from '../components/layout/SideBar';
import { Outlet } from 'react-router';

const AppLayout = () => {
	return (
		<>
			<NavBar />
			<SideBar />
			<Outlet />
		</>
	);
};

export default AppLayout;
