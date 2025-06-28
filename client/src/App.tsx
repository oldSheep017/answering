import React from "react"
import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { RootState } from "./store"
import { theme, darkTheme } from "./theme"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Questions from "./pages/Questions"
import History from "./pages/History"
import Test from "./pages/Test"
import ErrorBoundary from "./components/ErrorBoundary"
import TagManager from "./pages/TagManager"

/**
 * 主应用组件
 */
const App: React.FC = () => {
	const themeMode = useSelector((state: RootState) => state.theme.mode)
	const currentTheme = themeMode === "dark" ? darkTheme : theme

	return (
		<ErrorBoundary>
			<ThemeProvider theme={currentTheme}>
				<CssBaseline />
				<Layout>
					<Routes>
						<Route path='/' element={<Dashboard />} />
						<Route path='/questions' element={<Questions />} />
						<Route path='/history' element={<History />} />
						<Route path='/test' element={<Test />} />
						<Route path='/manager/tags' element={<TagManager />} />
					</Routes>
				</Layout>
			</ThemeProvider>
		</ErrorBoundary>
	)
}

export default App
