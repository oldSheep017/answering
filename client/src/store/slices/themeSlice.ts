import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ThemeMode } from "@/types"

interface ThemeState {
	mode: ThemeMode
}

const initialState: ThemeState = {
	mode: (localStorage.getItem("theme") as ThemeMode) || "light"
}

/**
 * 主题状态管理 slice
 */
const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		/**
		 * 切换主题模式
		 */
		toggleTheme: state => {
			state.mode = state.mode === "light" ? "dark" : "light"
			localStorage.setItem("theme", state.mode)
		},
		/**
		 * 设置主题模式
		 */
		setTheme: (state, action: PayloadAction<ThemeMode>) => {
			state.mode = action.payload
			localStorage.setItem("theme", state.mode)
		}
	}
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
