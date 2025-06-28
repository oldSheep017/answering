import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Question, TestResult, TestConfig } from "@/types"
import api from "@/services/api"

interface TestState {
	currentTest: Question[] | null
	answers: string[]
	currentQuestion: number
	timeSpent: number
	isStarted: boolean
	isFinished: boolean
	result: TestResult | null
	loading: boolean
	error: string | null
}

const initialState: TestState = {
	currentTest: null,
	answers: [],
	currentQuestion: 0,
	timeSpent: 0,
	isStarted: false,
	isFinished: false,
	result: null,
	loading: false,
	error: null
}

export const generateRandomTest = createAsyncThunk("test/generateRandomTest", async (config: TestConfig) => {
	const response = await api.generateRandomTest(config)
	return response
})

export const submitTest = createAsyncThunk(
	"test/submitTest",
	async (data: { userId?: string; questions: Question[]; answers: string[]; timeSpent: number; tags?: string[]; testType?: "random" | "custom" }) => {
		const response = await api.submitTest(data)
		return response
	}
)

const testSlice = createSlice({
	name: "test",
	initialState,
	reducers: {
		startTest: state => {
			state.isStarted = true
			state.isFinished = false
			state.currentQuestion = 0
			state.timeSpent = 0
			state.result = null
		},
		setAnswer: (state, action: PayloadAction<{ index: number; answer: string }>) => {
			const { index, answer } = action.payload
			state.answers[index] = answer
		},
		nextQuestion: state => {
			if (state.currentTest && state.currentQuestion < state.currentTest.length - 1) {
				state.currentQuestion += 1
			}
		},
		prevQuestion: state => {
			if (state.currentQuestion > 0) {
				state.currentQuestion -= 1
			}
		},
		goToQuestion: (state, action: PayloadAction<number>) => {
			if (state.currentTest && action.payload >= 0 && action.payload < state.currentTest.length) {
				state.currentQuestion = action.payload
			}
		},
		updateTime: (state, action: PayloadAction<number>) => {
			state.timeSpent = action.payload
		},
		resetTest: state => {
			state.currentTest = null
			state.answers = []
			state.currentQuestion = 0
			state.timeSpent = 0
			state.isStarted = false
			state.isFinished = false
			state.result = null
			state.loading = false
			state.error = null
		},
		clearError: state => {
			state.error = null
		}
	},
	extraReducers: builder => {
		builder
			.addCase(generateRandomTest.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(generateRandomTest.fulfilled, (state, action) => {
				state.loading = false
				state.currentTest = action.payload.questions
				state.answers = new Array(action.payload.questions.length).fill("")
				state.currentQuestion = 0
				state.timeSpent = 0
				state.isStarted = false
				state.isFinished = false
				state.result = null
			})
			.addCase(generateRandomTest.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "生成测试失败"
			})
			.addCase(submitTest.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(submitTest.fulfilled, (state, action) => {
				state.loading = false
				state.isFinished = true
				state.result = action.payload.result
			})
			.addCase(submitTest.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "提交测试失败"
			})
	}
})

export const { startTest, setAnswer, nextQuestion, prevQuestion, goToQuestion, updateTime, resetTest, clearError } = testSlice.actions

export default testSlice.reducer
