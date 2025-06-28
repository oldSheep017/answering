import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { History, ScoreStats, ChartData, Pagination } from "@/types"
import api from "@/services/api"
import { HistoryRecord } from "@/types"

export interface HistoryQuery {
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: "asc" | "desc"
	startDate?: string
	endDate?: string
}

interface HistoryState {
	items: HistoryRecord[]
	loading: boolean
	error: string | null
	pagination: Pagination
	stats: ScoreStats | null
	chartData: ChartData[]
	query: HistoryQuery
}

const initialState: HistoryState = {
	items: [],
	loading: false,
	error: null,
	pagination: {
		page: 1,
		limit: 10,
		total: 0,
		pages: 0
	},
	stats: null,
	chartData: [],
	query: { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }
}

/**
 * 异步 action：获取历史记录列表
 */
export const fetchHistory = createAsyncThunk("history/fetchHistory", async (params: HistoryQuery = {}) => {
	const res = await api.get("/history", { params })
	return res.data
})

/**
 * 异步 action：获取成绩统计
 */
export const fetchScoreStats = createAsyncThunk("history/fetchScoreStats", async (params?: { userId?: string; days?: number }) => {
	const response = await api.getScoreStats(params)
	return response
})

/**
 * 异步 action：删除历史记录
 */
export const deleteHistory = createAsyncThunk("history/deleteHistory", async (id: string) => {
	await api.deleteHistory(id)
	return id
})

/**
 * 历史记录状态管理 slice
 */
const historySlice = createSlice({
	name: "history",
	initialState,
	reducers: {
		/**
		 * 清除错误
		 */
		clearError: state => {
			state.error = null
		},
		/**
		 * 重置状态
		 */
		reset: state => {
			state.items = []
			state.loading = false
			state.error = null
			state.pagination = initialState.pagination
			state.stats = null
			state.chartData = []
			state.query = initialState.query
		},
		setHistoryQuery(state, action) {
			state.query = { ...state.query, ...action.payload }
		}
	},
	extraReducers: builder => {
		// fetchHistory
		builder
			.addCase(fetchHistory.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchHistory.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload.items
				state.pagination = action.payload.pagination
			})
			.addCase(fetchHistory.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "获取历史记录失败"
			})

		// fetchScoreStats
		builder
			.addCase(fetchScoreStats.pending, state => {
				state.error = null
			})
			.addCase(fetchScoreStats.fulfilled, (state, action) => {
				state.stats = action.payload.stats
				state.chartData = action.payload.chartData
			})
			.addCase(fetchScoreStats.rejected, (state, action) => {
				state.error = action.error.message || "获取成绩统计失败"
			})

		// deleteHistory
		builder
			.addCase(deleteHistory.fulfilled, (state, action) => {
				state.items = state.items.filter(item => item._id !== action.payload)
				state.pagination.total -= 1
			})
			.addCase(deleteHistory.rejected, (state, action) => {
				state.error = action.error.message || "删除历史记录失败"
			})
	}
})

export const { clearError, reset, setHistoryQuery } = historySlice.actions
export default historySlice.reducer
