import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { History, ScoreStats, ChartData, Pagination } from "@/types"
import api from "@/services/api"

interface HistoryState {
	items: History[]
	loading: boolean
	error: string | null
	pagination: Pagination
	stats: ScoreStats | null
	chartData: ChartData[]
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
	chartData: []
}

/**
 * 异步 action：获取历史记录列表
 */
export const fetchHistories = createAsyncThunk(
	"history/fetchHistories",
	async (params?: {
		page?: number
		limit?: number
		userId?: string
		startDate?: string
		endDate?: string
		sortBy?: string
		sortOrder?: "asc" | "desc"
	}) => {
		const response = await api.getHistories(params)
		return response
	}
)

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
		}
	},
	extraReducers: builder => {
		// fetchHistories
		builder
			.addCase(fetchHistories.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchHistories.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload.histories
				state.pagination = action.payload.pagination
			})
			.addCase(fetchHistories.rejected, (state, action) => {
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

export const { clearError, reset } = historySlice.actions
export default historySlice.reducer
