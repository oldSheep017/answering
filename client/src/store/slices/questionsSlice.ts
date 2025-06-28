import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Question, QuestionStats, Pagination } from "@/types"
import api from "@/services/api"

interface QuestionsState {
	items: Question[]
	loading: boolean
	error: string | null
	pagination: Pagination
	stats: QuestionStats | null
}

const initialState: QuestionsState = {
	items: [],
	loading: false,
	error: null,
	pagination: {
		page: 1,
		limit: 10,
		total: 0,
		pages: 0
	},
	stats: null
}

/**
 * 异步 action：获取题目列表
 */
export const fetchQuestions = createAsyncThunk(
	"questions/fetchQuestions",
	async (params?: {
		page?: number
		limit?: number
		type?: "choice" | "fill"
		tags?: string
		difficulty?: "easy" | "medium" | "hard"
		search?: string
		sortBy?: string
		sortOrder?: "asc" | "desc"
	}) => {
		const response = await api.getQuestions(params)
		return response
	}
)

/**
 * 异步 action：获取题目统计
 */
export const fetchQuestionStats = createAsyncThunk("questions/fetchStats", async () => {
	const response = await api.getQuestionStats()
	return response
})

/**
 * 异步 action：创建题目
 */
export const createQuestion = createAsyncThunk(
	"questions/createQuestion",
	async (data: {
		type: "choice" | "fill"
		title: string
		options?: string[]
		answer: string
		tags?: string[]
		difficulty?: "easy" | "medium" | "hard"
	}) => {
		const response = await api.createQuestion(data)
		return response
	}
)

/**
 * 异步 action：更新题目
 */
export const updateQuestion = createAsyncThunk(
	"questions/updateQuestion",
	async ({
		id,
		data
	}: {
		id: string
		data: {
			type: "choice" | "fill"
			title: string
			options?: string[]
			answer: string
			tags?: string[]
			difficulty?: "easy" | "medium" | "hard"
		}
	}) => {
		const response = await api.updateQuestion(id, data)
		return response
	}
)

/**
 * 异步 action：删除题目
 */
export const deleteQuestion = createAsyncThunk("questions/deleteQuestion", async (id: string) => {
	await api.deleteQuestion(id)
	return id
})

/**
 * 异步 action：批量导入题目
 */
export const importQuestions = createAsyncThunk("questions/importQuestions", async (questions: any[]) => {
	const response = await api.importQuestions(questions)
	return response
})

/**
 * 题目状态管理 slice
 */
const questionsSlice = createSlice({
	name: "questions",
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
		}
	},
	extraReducers: builder => {
		// fetchQuestions
		builder
			.addCase(fetchQuestions.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchQuestions.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload.questions
				state.pagination = action.payload.pagination
			})
			.addCase(fetchQuestions.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "获取题目失败"
			})

		// fetchQuestionStats
		builder
			.addCase(fetchQuestionStats.pending, state => {
				state.error = null
			})
			.addCase(fetchQuestionStats.fulfilled, (state, action) => {
				state.stats = action.payload
			})
			.addCase(fetchQuestionStats.rejected, (state, action) => {
				state.error = action.error.message || "获取统计信息失败"
			})

		// createQuestion
		builder
			.addCase(createQuestion.fulfilled, (state, action) => {
				state.items.unshift(action.payload)
				state.pagination.total += 1
			})
			.addCase(createQuestion.rejected, (state, action) => {
				state.error = action.error.message || "创建题目失败"
			})

		// updateQuestion
		builder
			.addCase(updateQuestion.fulfilled, (state, action) => {
				const index = state.items.findIndex(item => item._id === action.payload._id)
				if (index !== -1) {
					state.items[index] = action.payload
				}
			})
			.addCase(updateQuestion.rejected, (state, action) => {
				state.error = action.error.message || "更新题目失败"
			})

		// deleteQuestion
		builder
			.addCase(deleteQuestion.fulfilled, (state, action) => {
				state.items = state.items.filter(item => item._id !== action.payload)
				state.pagination.total -= 1
			})
			.addCase(deleteQuestion.rejected, (state, action) => {
				state.error = action.error.message || "删除题目失败"
			})

		// importQuestions
		builder
			.addCase(importQuestions.fulfilled, (state, action) => {
				// 导入后刷新题库
				if (action.payload && action.payload.questions) {
					state.items = action.payload.questions
					state.pagination.total = action.payload.imported || action.payload.questions.length
				}
			})
			.addCase(importQuestions.rejected, (state, action) => {
				state.error = action.error.message || "批量导入失败"
			})
	}
})

export const { clearError, reset } = questionsSlice.actions
export default questionsSlice.reducer
