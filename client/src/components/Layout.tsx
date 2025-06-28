import React from "react"
import { Box, AppBar, Toolbar, Typography, IconButton, Container } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../store"
import { toggleTheme } from "../store/slices/themeSlice"

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const dispatch = useDispatch()
	const themeMode = useSelector((state: RootState) => state.theme.mode)

	const handleThemeToggle = () => {
		dispatch(toggleTheme())
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<AppBar position='static' elevation={0}>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						题库管理系统
					</Typography>
					<IconButton color='inherit' onClick={handleThemeToggle} aria-label='切换主题'>
						{themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
					</IconButton>
				</Toolbar>
			</AppBar>

			<Container component='main' sx={{ flexGrow: 1, py: 3 }}>
				{children}
			</Container>

			<Box
				component='footer'
				sx={{
					py: 3,
					px: 2,
					mt: "auto",
					backgroundColor: theme => (theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800])
				}}
			>
				<Container maxWidth='sm'>
					<Typography variant='body2' color='text.secondary' align='center'>
						© 题库管理系统. 专为【亡羊Nassas】构建.
					</Typography>
				</Container>
			</Box>
		</Box>
	)
}

export default Layout
