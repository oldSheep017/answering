import React from "react"
import { Box, Typography, Paper, Stack, Chip } from "@mui/material"
import { useLocation } from "react-router-dom"
import { Question } from "@/types"

const getAnswerColor = (userAns: string, correctAns: string) => {
	if (userAns === correctAns) return "success.main"
	if (!userAns) return "warning.main"
	return "error.main"
}

const TestResult: React.FC = () => {
	const location = useLocation()
	// 假设通过location.state传递了试卷详情
	const { questions = [], answers = [], score = 0, total = 0, duration = 0 } = location.state || {}

	return (
		<Box>
			<Typography variant='h4' mb={2}>
				试卷详情
			</Typography>
			<Typography variant='body1' mb={2}>
				得分：{score} / {total}，用时：{duration} 秒
			</Typography>
			<Stack spacing={2}>
				{questions.map((q: Question, idx: number) => {
					const userAns = answers[idx]?.answer ?? ""
					const isCorrect = userAns === q.answer
					return (
						<Paper
							key={q._id || idx}
							sx={{ p: 2, borderLeft: 4, borderColor: isCorrect ? "success.main" : "error.main", bgcolor: isCorrect ? "success.50" : "error.50" }}
						>
							<Stack spacing={1}>
								<Typography variant='subtitle1' fontWeight={600}>
									{idx + 1}. [{q.type === "choice" ? "选择题" : "填空题"}] {q.title}
								</Typography>
								{q.type === "choice" && (
									<Stack direction='row' spacing={1} flexWrap='wrap'>
										{q.options.map((opt, i) => (
											<Chip
												key={i}
												label={opt}
												color={opt === q.answer ? "success" : opt === userAns ? "error" : "default"}
												variant={opt === q.answer || opt === userAns ? "filled" : "outlined"}
												sx={{ fontWeight: opt === q.answer ? 700 : 400 }}
											/>
										))}
									</Stack>
								)}
								<Typography>
									你的答案：
									<Box component='span' color={getAnswerColor(userAns, q.answer)} fontWeight={600}>
										{userAns || "未作答"}
									</Box>
								</Typography>
								{!isCorrect && (
									<Typography>
										正确答案：
										<Box component='span' color='success.main' fontWeight={600}>
											{q.answer}
										</Box>
									</Typography>
								)}
							</Stack>
						</Paper>
					)
				})}
			</Stack>
		</Box>
	)
}

export default TestResult
