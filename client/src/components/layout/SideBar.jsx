import React, { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavLinks from './NavLinks';

const SideBar = () => {
	const [open, setOpen] = useState(false);

	const toggleMenu = () => {
		setOpen((isOpen) => !isOpen);
	};

	return (
		<>
			<IconButton
				onClick={toggleMenu}
				size='large'
				edge='start'
				color='inherit'
				aria-label='menu'
				sx={{ mr: 2 }}>
				<MenuIcon />
			</IconButton>
			<Drawer open={open} onClose={toggleMenu}>
				<NavLinks toggle={toggleMenu} />
			</Drawer>
		</>
	);
};

export default SideBar;
