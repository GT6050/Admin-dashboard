import React from 'react';
import { Route, Routes } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';

import Dashboard from '../pages/Dashboard.jsx';
import Login from '../pages/Login.jsx';
import Users from '../pages/Users.jsx';
import CreateUser from '../pages/CreateUser.jsx';
import UserDetails from '../pages/UserDetails.jsx';
import Roles from '../pages/Roles.jsx';
import Permissions from '../pages/Permissions.jsx';
import PasswordReset from '../pages/PasswordReset.jsx';
import NoPermissions from '../pages/NoPermissions.jsx';
import NotFound from '../pages/NotFound.jsx';
import Home from '../pages/Home.jsx';
import AppLayout from '../pages/AppLayout.jsx';

const App = () => {
	return (
		<>
			<CssBaseline />
			<Routes>
				<Route element={<AppLayout />}>
					<Route index element={<Home />} />
					<Route path='dashboard' element={<Dashboard />} />

					<Route path='users'>
						<Route index element={<Users />} />

						<Route path='create' element={<CreateUser />} />
						<Route path=':id' element={<UserDetails />} />
					</Route>

					<Route path='roles' element={<Roles />} />
					<Route path='permissions' element={<Permissions />} />

					<Route path='*' element={<NotFound />} />
					<Route path='403' element={<NoPermissions />} />
				</Route>
				<Route path='login' element={<Login />} />
				<Route path='reset-password/:token' element={<PasswordReset />} />
			</Routes>
		</>
	);
};

export default App;
