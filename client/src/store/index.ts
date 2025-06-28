import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "./slices/themeSlice"
import questionsReducer from "./slices/questionsSlice"
import historyReducer from "./slices/historySlice"
import testReducer from "./slices/testSlice"

/**
 * Redux store 配置
 */
export const store = configureStore({
	reducer: {
		theme: themeReducer,
		questions: questionsReducer,
		history: historyReducer,
		test: testReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				// 忽略非序列化值
				ignoredActions: ["persist/PERSIST"],
				ignoredPaths: ["test.currentTest"]
			}
		})
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
