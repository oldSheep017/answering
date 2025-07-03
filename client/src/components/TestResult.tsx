import React from "react"
import { Box, Typography, Card, CardContent, Stack, Chip, Button, Divider } from "@mui/material"
import { TestResult, History } from "@/types"

interface TestResultProps {
	result: TestResult
	history: History
	onRestart: () => void
}

/**
 * 测试结果展示组件
 */
const TestResultComp: React.FC<TestResultProps> = ({ result, history, onRestart }) => {
	// 格式化时间
	const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`

	return (
		<Box sx={{ maxWidth: 520, mx: "auto", mt: 4 }}>
			<Card sx={{ borderRadius: 3, boxShadow: 4, mb: 2 }}>
				<CardContent>
					<Typography variant='h5' align='center' gutterBottom>
						测试结果
					</Typography>
					<Stack direction='row' spacing={2} justifyContent='center' mb={2}>
						<Chip label={`得分：${result.score}`} color='primary' size='medium' />
						<Chip label={`正确率：${result.accuracy}%`} color='success' size='medium' />
						<Chip label={`用时：${formatTime(result.timeSpent)}`} color='secondary' size='medium' />
					</Stack>
					<Divider sx={{ my: 2 }} />
					<Typography variant='h6' gutterBottom>
						错题解析
					</Typography>
					{history.details.filter(d => !d.isCorrect).length === 0 ? (
						<Typography color='success.main'>全部答对，太棒了！</Typography>
					) : (
						<Stack spacing={2}>
							{history.details
								.filter(d => !d.isCorrect)
								.map((d, idx) => (
									<Card key={idx} variant='outlined' sx={{ bgcolor: "grey.50" }}>
										<CardContent>
											<Typography variant='subtitle1' gutterBottom>
												{d.questionTitle}
											</Typography>
											<Typography variant='body2' color='error.main'>
												你的答案：{d.userAnswer}
											</Typography>
											<Typography variant='body2' color='success.main'>
												正确答案：{d.correctAnswer || "（无）"}
											</Typography>
										</CardContent>
									</Card>
								))}
						</Stack>
					)}
					<Button variant='contained' color='primary' fullWidth sx={{ mt: 3 }} onClick={onRestart}>
						再来一次
					</Button>
				</CardContent>
			</Card>
		</Box>
	)
}

export default TestResultComp
