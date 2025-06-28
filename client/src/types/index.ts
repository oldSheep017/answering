/**
 * 题目类型定义
 */
export interface Question {
	_id: string
	type: "choice" | "fill"
	title: string
	options: string[]
	answer: string
	tags: string[]
	difficulty: "easy" | "medium" | "hard"
	isActive: boolean
	createdAt: string
	updatedAt: string
	typeText?: string
}

/**
 * 答题详情类型定义
 */
export interface AnswerDetail {
	questionId: string
	userAnswer: string
	isCorrect: boolean
	questionType: "choice" | "fill"
	questionTitle: string
	correctAnswer: string
	options: string[]
}

/**
 * 历史记录类型定义
 */
export interface History {
	_id: string
	userId: string
	date: string
	score: number
	totalQuestions: number
	correctAnswers: number
	timeSpent: number
	details: AnswerDetail[]
	tags: string[]
	testType: "random" | "custom"
	createdAt: string
	updatedAt: string
	accuracy?: number
	timeSpentFormatted?: string
}

/**
 * 分页信息类型定义
 */
export interface Pagination {
	page: number
	limit: number
	total: number
	pages: number
}

/**
 * API 响应类型定义
 */
export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: {
		message: string
		stack?: string
	}
	timestamp?: string
}

/**
 * 题目列表响应类型定义
 */
export interface QuestionsResponse {
	questions: Question[]
	pagination: Pagination
}

/**
 * 历史记录列表响应类型定义
 */
export interface HistoriesResponse {
	histories: History[]
	pagination: Pagination
}

/**
 * 题目统计信息类型定义
 */
export interface QuestionStats {
	total: number
	choiceCount: number
	fillCount: number
	easyCount: number
	mediumCount: number
	hardCount: number
	tagStats: Array<{
		_id: string
		count: number
	}>
}

/**
 * 成绩统计信息类型定义
 */
export interface ScoreStats {
	totalTests: number
	averageScore: number
	bestScore: number
	worstScore: number
	totalQuestions: number
	totalCorrect: number
	averageTime: number
}

/**
 * 图表数据类型定义
 */
export interface ChartData {
	date: string
	averageScore: number
	testCount: number
	accuracy: number
}

/**
 * 成绩统计响应类型定义
 */
export interface ScoreStatsResponse {
	stats: ScoreStats
	chartData: ChartData[]
}

/**
 * 测试配置类型定义
 */
export interface TestConfig {
	questionCount: number
	types: ("choice" | "fill")[]
	tags: string[]
	difficulty?: "easy" | "medium" | "hard"
}

/**
 * 测试信息类型定义
 */
export interface TestInfo {
	questionCount: number
	types: ("choice" | "fill")[]
	tags: string[]
	difficulty?: "easy" | "medium" | "hard"
	generatedAt: string
}

/**
 * 随机测试响应类型定义
 */
export interface RandomTestResponse {
	questions: Question[]
	testInfo: TestInfo
}

/**
 * 答题结果类型定义
 */
export interface TestResult {
	score: number
	correctAnswers: number
	totalQuestions: number
	accuracy: number
	timeSpent: number
}

/**
 * 提交测试响应类型定义
 */
export interface SubmitTestResponse {
	history: History
	result: TestResult
}

/**
 * 主题模式类型定义
 */
export type ThemeMode = "light" | "dark"

/**
 * 应用状态类型定义
 */
export interface AppState {
	theme: {
		mode: ThemeMode
	}
	questions: {
		items: Question[]
		loading: boolean
		error: string | null
		pagination: Pagination
		stats: QuestionStats | null
	}
	history: {
		items: History[]
		loading: boolean
		error: string | null
		pagination: Pagination
		stats: ScoreStats | null
		chartData: ChartData[]
	}
	test: {
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
}

export interface Tag {
	_id: string
	name: string
	desc?: string
	color?: string
	createdAt?: string
	updatedAt?: string
}

export interface HistoryRecord {
	_id: string
	createdAt: string
	score: number
	total: number
	duration: number
	questions: any[]
	answers: any[]
	// 可根据实际需要补充更多字段
}
