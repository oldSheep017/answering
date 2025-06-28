import React, { useEffect, useRef } from "react"
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	RadioGroup,
	FormControlLabel,
	Radio,
	TextField,
	Stack,
	MobileStepper,
	LinearProgress,
	Chip
} from "@mui/material"
import { Question } from "@/types"

interface TestPaperProps {
	questions: Question[]
	answers: string[]
	current: number
	timeSpent: number
	onAnswer: (index: number, answer: string) => void
	onNext: () => void
	onPrev: () => void
	onGo: (index: number) => void
	onSubmit: () => void
	onTimeUpdate: (time: number) => void
	isFinished: boolean
	loading: boolean
}

/**
 * 试卷答题卡组件
 */
const TestPaper: React.FC<TestPaperProps> = ({
	questions,
	answers,
	current,
	timeSpent,
	onAnswer,
	onNext,
	onPrev,
	onGo,
	onSubmit,
	onTimeUpdate,
	isFinished,
	loading
}) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	// 计时
	useEffect(() => {
		if (!isFinished && !loading) {
			timerRef.current = setInterval(() => {
				onTimeUpdate(timeSpent + 1)
			}, 1000)
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
		// eslint-disable-next-line
	}, [isFinished, loading, timeSpent])

	if (!questions.length) return null
	const q = questions[current]
	const total = questions.length
	const percent = Math.round(((current + 1) / total) * 100)

	// 判断选择题即时反馈
	const isChoice = q.type === "choice"
	const userAnswer = answers[current] || ""
	const showFeedback = isChoice && userAnswer
	const isCorrect = isChoice && userAnswer === q.answer

	// 格式化时间
	const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`

	return (
		<Box sx={{ maxWidth: 520, mx: "auto", mt: 4 }}>
			<Card sx={{ borderRadius: 3, boxShadow: 4, mb: 2, transition: "box-shadow 0.3s" }}>
				<CardContent>
					<Stack direction='row' spacing={1} alignItems='center' mb={1}>
						<Chip label={q.type === "choice" ? "选择题" : "填空题"} color={q.type === "choice" ? "primary" : "success"} size='small' />
						{q.tags.map(tag => (
							<Chip key={tag} label={tag} size='small' variant='outlined' />
						))}
						<Chip label={q.difficulty === "easy" ? "简单" : q.difficulty === "medium" ? "中等" : "困难"} size='small' color='secondary' />
					</Stack>
					<Typography variant='h6' gutterBottom>
						{current + 1}. {q.title}
					</Typography>
					{q.type === "choice" ? (
						<RadioGroup value={userAnswer} onChange={e => onAnswer(current, e.target.value)}>
							{q.options.map((opt, idx) => (
								<FormControlLabel key={idx} value={opt} control={<Radio color='primary' />} label={opt} disabled={isFinished} />
							))}
						</RadioGroup>
					) : (
						<TextField
							label='请输入答案'
							value={userAnswer}
							onChange={e => onAnswer(current, e.target.value)}
							fullWidth
							disabled={isFinished}
							autoFocus
						/>
					)}
					{/* 选择题即时反馈 */}
					{showFeedback && !isFinished && (
						<Typography color={isCorrect ? "success.main" : "error.main"} sx={{ mt: 1 }}>
							{isCorrect ? "回答正确！" : `错误，正确答案：${q.answer}`}
						</Typography>
					)}
				</CardContent>
			</Card>
			<Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' mb={2}>
				<Typography variant='body2'>用时：{formatTime(timeSpent)}</Typography>
				<Typography variant='body2'>
					进度：{current + 1}/{total}
				</Typography>
			</Stack>
			<LinearProgress variant='determinate' value={percent} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
			<MobileStepper
				variant='dots'
				steps={total}
				position='static'
				activeStep={current}
				nextButton={
					<Button size='small' onClick={onNext} disabled={current === total - 1 || loading}>
						下一题
					</Button>
				}
				backButton={
					<Button size='small' onClick={onPrev} disabled={current === 0 || loading}>
						上一题
					</Button>
				}
				sx={{ mb: 2, bgcolor: "transparent" }}
			/>
			<Stack direction='row' spacing={1} justifyContent='center' mb={2}>
				{questions.map((_, idx) => (
					<Button
						key={idx}
						size='small'
						variant={idx === current ? "contained" : "outlined"}
						color={answers[idx] ? "primary" : "inherit"}
						onClick={() => onGo(idx)}
						sx={{ minWidth: 32, p: 0, borderRadius: "50%" }}
					>
						{idx + 1}
					</Button>
				))}
			</Stack>
			<Button variant='contained' color='success' fullWidth size='large' onClick={onSubmit} disabled={isFinished || loading || answers.some(a => !a)}>
				提交试卷
			</Button>
		</Box>
	)
}

export default TestPaper
