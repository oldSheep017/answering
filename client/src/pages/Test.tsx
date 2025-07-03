import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import TestConfigForm from "@/components/TestConfigForm"
import TestPaper from "@/components/TestPaper"
import TestResultComp from "@/components/TestResult"
import {
	generateRandomTest,
	submitTest,
	startTest,
	setAnswer,
	nextQuestion,
	prevQuestion,
	goToQuestion,
	updateTime,
	resetTest
} from "@/store/slices/testSlice"
import { TestConfig } from "@/types"
import { CircularProgress, Box } from "@mui/material"

/**
 * 测试页面组件
 */
const Test: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const test = useSelector((state: RootState) => state.test)

	// 开始测试
	const handleStart = useCallback(
		(config: TestConfig) => {
			dispatch(resetTest())
			dispatch(generateRandomTest(config))
		},
		[dispatch]
	)

	// 进入答题
	React.useEffect(() => {
		if (test.currentTest && !test.isStarted && !test.isFinished) {
			dispatch(startTest())
		}
	}, [test.currentTest, test.isStarted, test.isFinished, dispatch])

	// 提交试卷
	const handleSubmit = useCallback(() => {
		if (test.currentTest) {
			dispatch(
				submitTest({
					questions: test.currentTest,
					answers: test.answers,
					timeSpent: test.timeSpent
				})
			)
		}
	}, [dispatch, test.currentTest, test.answers, test.timeSpent])

	// 再来一次
	const handleRestart = useCallback(() => {
		dispatch(resetTest())
	}, [dispatch])

	// 渲染逻辑
	if (test.loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		)
	}

	if (test.result && test.currentTest && test.isFinished) {
		return (
			<TestResultComp
				result={test.result}
				history={{
					_id: "",
					userId: "",
					date: "",
					score: test.result.score,
					totalQuestions: test.result.totalQuestions,
					correctAnswers: test.result.correctAnswers,
					timeSpent: test.result.timeSpent,
					details: test.currentTest.map((q, idx) => {
						const userAnswer = typeof test.answers[idx] === "string" ? test.answers[idx].trim().toLowerCase() : ""
						const correctAnswer = typeof q.answer === "string" ? q.answer.trim().toLowerCase() : ""
						const isCorrect = userAnswer === correctAnswer
						return {
							questionId: q._id,
							userAnswer: test.answers[idx],
							isCorrect,
							questionType: q.type,
							questionTitle: q.title,
							correctAnswer: q.answer,
							options: q.options
						}
					}),
					tags: [],
					testType: "random",
					createdAt: "",
					updatedAt: ""
				}}
				onRestart={handleRestart}
			/>
		)
	}

	if (test.currentTest && test.isStarted) {
		return (
			<TestPaper
				questions={test.currentTest}
				answers={test.answers}
				current={test.currentQuestion}
				timeSpent={test.timeSpent}
				onAnswer={(idx, ans) => dispatch(setAnswer({ index: idx, answer: ans }))}
				onNext={() => dispatch(nextQuestion())}
				onPrev={() => dispatch(prevQuestion())}
				onGo={idx => dispatch(goToQuestion(idx))}
				onSubmit={handleSubmit}
				onTimeUpdate={t => dispatch(updateTime(t))}
				isFinished={test.isFinished}
				loading={test.loading}
			/>
		)
	}

	// 默认显示自测配置表单
	return <TestConfigForm loading={test.loading} onStart={handleStart} />
}

export default Test
