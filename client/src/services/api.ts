import axios, { AxiosResponse } from "axios"
import {
	ApiResponse,
	QuestionsResponse,
	HistoriesResponse,
	Question,
	History,
	QuestionStats,
	ScoreStatsResponse,
	RandomTestResponse,
	SubmitTestResponse,
	TestConfig,
	Tag
} from "@/types"

/**
 * API 服务类
 * 提供与后端 API 的通信功能
 */
class ApiService {
	private baseURL: string

	constructor() {
		this.baseURL = "http://49.233.166.239:5000/api"
	}

	/**
	 * 创建 axios 实例
	 */
	private createInstance() {
		return axios.create({
			baseURL: this.baseURL,
			timeout: 10000,
			headers: {
				"Content-Type": "application/json"
			}
		})
	}

	/**
	 * 处理 API 响应
	 */
	private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
		if (response.data.success) {
			return response.data.data!
		} else {
			throw new Error(response.data.error?.message || "请求失败")
		}
	}

	/**
	 * 处理错误
	 */
	private handleError(error: any): never {
		if (error.response) {
			const message = error.response.data?.error?.message || "请求失败"
			throw new Error(message)
		} else if (error.request) {
			throw new Error("网络连接失败")
		} else {
			throw new Error(error.message || "未知错误")
		}
	}

	// ==================== 题目管理 API ====================

	/**
	 * 获取题目列表
	 */
	async getQuestions(params?: {
		page?: number
		limit?: number
		type?: "choice" | "fill"
		tags?: string
		difficulty?: "easy" | "medium" | "hard"
		search?: string
		sortBy?: string
		sortOrder?: "asc" | "desc"
	}): Promise<QuestionsResponse> {
		try {
			const response = await this.createInstance().get<ApiResponse<QuestionsResponse>>("/questions", {
				params
			})
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 获取单个题目
	 */
	async getQuestion(id: string): Promise<Question> {
		try {
			const response = await this.createInstance().get<ApiResponse<Question>>(`/questions/${id}`)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 创建题目
	 */
	async createQuestion(data: {
		type: "choice" | "fill"
		title: string
		options?: string[]
		answer: string
		tags?: string[]
		difficulty?: "easy" | "medium" | "hard"
	}): Promise<Question> {
		try {
			const response = await this.createInstance().post<ApiResponse<Question>>("/questions", data)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 更新题目
	 */
	async updateQuestion(
		id: string,
		data: {
			type: "choice" | "fill"
			title: string
			options?: string[]
			answer: string
			tags?: string[]
			difficulty?: "easy" | "medium" | "hard"
		}
	): Promise<Question> {
		try {
			const response = await this.createInstance().put<ApiResponse<Question>>(`/questions/${id}`, data)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 删除题目
	 */
	async deleteQuestion(id: string): Promise<{ message: string }> {
		try {
			const response = await this.createInstance().delete<ApiResponse<{ message: string }>>(`/questions/${id}`)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 获取题目统计
	 */
	async getQuestionStats(): Promise<QuestionStats> {
		try {
			const response = await this.createInstance().get<ApiResponse<QuestionStats>>("/questions/stats")
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 批量导入题目
	 */
	async importQuestions(questions: any[]): Promise<{ imported: number; questions: Question[] }> {
		try {
			const response = await this.createInstance().post<ApiResponse<{ imported: number; questions: Question[] }>>("/questions/import", {
				questions
			})
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 导出题目
	 */
	async exportQuestions(params?: { type?: "choice" | "fill"; tags?: string }): Promise<{ questions: Question[]; exportTime: string; total: number }> {
		try {
			const response = await this.createInstance().get<ApiResponse<{ questions: Question[]; exportTime: string; total: number }>>(
				"/questions/export",
				{
					params
				}
			)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	// ==================== 历史记录 API ====================

	/**
	 * 获取历史记录列表
	 */
	async getHistories(params?: {
		page?: number
		limit?: number
		userId?: string
		startDate?: string
		endDate?: string
		sortBy?: string
		sortOrder?: "asc" | "desc"
	}): Promise<HistoriesResponse> {
		try {
			const response = await this.createInstance().get<ApiResponse<HistoriesResponse>>("/history", {
				params
			})
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 获取单个历史记录
	 */
	async getHistory(id: string): Promise<History> {
		try {
			const response = await this.createInstance().get<ApiResponse<History>>(`/history/${id}`)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 获取成绩统计
	 */
	async getScoreStats(params?: { userId?: string; days?: number }): Promise<ScoreStatsResponse> {
		try {
			const response = await this.createInstance().get<ApiResponse<ScoreStatsResponse>>("/history/stats", {
				params
			})
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 删除历史记录
	 */
	async deleteHistory(id: string): Promise<{ message: string }> {
		try {
			const response = await this.createInstance().delete<ApiResponse<{ message: string }>>(`/history/${id}`)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	// ==================== 测试 API ====================

	/**
	 * 生成随机测试
	 */
	async generateRandomTest(config: TestConfig): Promise<RandomTestResponse> {
		try {
			const response = await this.createInstance().post<ApiResponse<RandomTestResponse>>("/history/generate-test", config)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 提交测试结果
	 */
	async submitTest(data: {
		userId?: string
		questions: Question[]
		answers: string[]
		timeSpent: number
		tags?: string[]
		testType?: "random" | "custom"
	}): Promise<SubmitTestResponse> {
		try {
			const response = await this.createInstance().post<ApiResponse<SubmitTestResponse>>("/history/submit-test", data)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 健康检查
	 */
	async healthCheck(): Promise<{
		success: boolean
		message: string
		timestamp: string
		database: string
	}> {
		try {
			const response = await this.createInstance().get("/health")
			return response.data
		} catch (error) {
			this.handleError(error)
		}
	}

	// ==================== 标签管理 API ====================

	/**
	 * 获取所有标签
	 */
	async getTags(): Promise<Tag[]> {
		try {
			const response = await this.createInstance().get<ApiResponse<Tag[]>>("/tags")
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 创建标签
	 */
	async createTag(data: { name: string; desc?: string; color?: string }): Promise<Tag> {
		try {
			const response = await this.createInstance().post<ApiResponse<Tag>>("/tags", data)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 更新标签
	 */
	async updateTag(id: string, data: { name: string; desc?: string; color?: string }): Promise<Tag> {
		try {
			const response = await this.createInstance().put<ApiResponse<Tag>>(`/tags/${id}`, data)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}

	/**
	 * 删除标签
	 */
	async deleteTag(id: string): Promise<{ message: string }> {
		try {
			const response = await this.createInstance().delete<ApiResponse<{ message: string }>>(`/tags/${id}`)
			return this.handleResponse(response)
		} catch (error) {
			this.handleError(error)
		}
	}
}

export default new ApiService()
