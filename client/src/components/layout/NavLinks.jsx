import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router';

const linksList = ['Dashboard', 'Users', 'Roles', 'Permissions'];

const NavLinks = ({ ...props }) => {
	return (
		<>
			<Box sx={{ width: 250 }} role='presentation' onClick={props.toggle}>
				<List>
					{linksList.map((text, idx) => (
						<ListItem key={idx} disablePadding>
							<ListItemButton>
								<NavLink to={text.toLowerCase()}>
									<ListItemText primary={text} />
								</NavLink>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</>
	);
};

export default NavLinks;
