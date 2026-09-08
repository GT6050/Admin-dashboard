import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import SideBar from './SideBar';
import { NavLink } from 'react-router';

const NavBar = () => {
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position='static'>
					<Toolbar>
						<SideBar />
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							<NavLink to='/'>AdminDashboard</NavLink>
						</Typography>
						<Button color='inherit'>
							<NavLink to='login'>Login</NavLink>
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
		</>
	);
};

export default NavBar;
