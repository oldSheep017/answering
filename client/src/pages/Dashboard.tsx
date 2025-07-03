import React, { useEffect, useState } from "react"
import { Box, Typography, Grid, Card, CardContent, Button, CardActionArea, Stack, Paper, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { School, Quiz, History, Add } from "@mui/icons-material"
import api from "@/services/api"

const Dashboard: React.FC = () => {
	const navigate = useNavigate()
	const [stats, setStats] = useState({ total: 0, choiceCount: 0, fillCount: 0 })
	const [testCount, setTestCount] = useState(0)

	useEffect(() => {
		// 获取题库统计
		api.getQuestionStats().then(res => {
			if (res) setStats(res)
		})
		// 获取测试次数
		api.getScoreStats().then(res => {
			if (res && res.stats) setTestCount(res.stats.totalTests || 0)
		})
	}, [])

	const DASHBOARD_CARDS = [
		{
			title: "总题目数",
			value: stats.total,
			color: "primary",
			to: "/questions",
			desc: "管理和导入题库"
		},
		{
			title: "选择题",
			value: stats.choiceCount,
			color: "secondary",
			to: "/questions?type=choice",
			desc: "查看所有选择题"
		},
		{
			title: "填空题",
			value: stats.fillCount,
			color: "success",
			to: "/questions?type=fill",
			desc: "查看所有填空题"
		},
		{
			title: "测试次数",
			value: testCount,
			color: "warning",
			to: "/history",
			desc: "查看历史测试记录"
		},
		{
			title: "自测系统",
			value: "",
			color: "info",
			to: "/test",
			desc: "开始自测，随机生成试卷"
		},
		{
			title: "标签管理",
			value: "",
			color: "info",
			to: "/manager/tags",
			desc: "自定义题库标签"
		}
	]

	return (
		<Box>
			{/* 欢迎区域 */}
			<Paper
				sx={{
					p: 4,
					mb: 4,
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					color: "white",
					borderRadius: 3,
					position: "relative",
					overflow: "hidden"
				}}
			>
				<Box sx={{ position: "relative", zIndex: 2 }}>
					<Typography variant='h3' gutterBottom sx={{ fontWeight: 700 }}>
						欢迎使用题库管理系统
					</Typography>
					<Typography variant='h6' sx={{ mb: 2, opacity: 0.9 }}>
						专为【亡羊Nassas】构建的智能题库管理与自测平台
					</Typography>
					<Typography variant='body1' sx={{ opacity: 0.8, maxWidth: 600 }}>
						在这里，你可以轻松管理选择题和填空题，创建个性化测试，追踪学习进度。 支持批量导入导出，智能随机出题，让学习更加高效有趣！
					</Typography>
				</Box>
				{/* 装饰性背景元素 */}
				<Box
					sx={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 200,
						height: 200,
						borderRadius: "50%",
						background: "rgba(255,255,255,0.1)",
						zIndex: 1
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: -30,
						right: 50,
						width: 150,
						height: 150,
						borderRadius: "50%",
						background: "rgba(255,255,255,0.05)",
						zIndex: 1
					}}
				/>
			</Paper>

			{/* 快速开始提示 */}
			<Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
				<Typography variant='h5' gutterBottom sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
					<School color='primary' />
					快速开始
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								p: 2,
								bgcolor: "primary.50",
								borderRadius: 2,
								cursor: "pointer",
								transition: "all 0.2s",
								"&:hover": {
									bgcolor: "primary.100",
									transform: "translateY(-2px)",
									boxShadow: 2
								}
							}}
							onClick={() => navigate("/questions")}
						>
							<Add color='primary' />
							<Box>
								<Typography variant='subtitle1' fontWeight={600}>
									添加题目
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									开始构建你的题库
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								p: 2,
								bgcolor: "secondary.50",
								borderRadius: 2,
								cursor: "pointer",
								transition: "all 0.2s",
								"&:hover": {
									bgcolor: "secondary.100",
									transform: "translateY(-2px)",
									boxShadow: 2
								}
							}}
							onClick={() => navigate("/test")}
						>
							<Quiz color='secondary' />
							<Box>
								<Typography variant='subtitle1' fontWeight={600}>
									开始自测
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									随机生成个性化试卷
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								p: 2,
								bgcolor: "success.50",
								borderRadius: 2,
								cursor: "pointer",
								transition: "all 0.2s",
								"&:hover": {
									bgcolor: "success.100",
									transform: "translateY(-2px)",
									boxShadow: 2
								}
							}}
							onClick={() => navigate("/history")}
						>
							<History color='success' />
							<Box>
								<Typography variant='subtitle1' fontWeight={600}>
									查看历史
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									追踪学习进度和成绩
								</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Paper>

			<Typography variant='h4' gutterBottom>
				功能概览
			</Typography>
			<Grid container spacing={3}>
				{DASHBOARD_CARDS.map((card, idx) => (
					<Grid item xs={12} md={6} lg={3} key={card.title}>
						<Card
							sx={{
								borderRadius: 3,
								boxShadow: 3,
								transition: "box-shadow 0.2s, transform 0.2s",
								cursor: "pointer",
								"&:hover": {
									boxShadow: 8,
									transform: "translateY(-4px) scale(1.03)"
								}
							}}
							onClick={() => navigate(card.to)}
						>
							<CardActionArea>
								<CardContent>
									<Stack spacing={1} alignItems='flex-start'>
										<Typography variant='h6' gutterBottom>
											{card.title}
										</Typography>
										<Typography variant='h4' color={`${card.color}.main`}>
											{card.value}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{card.desc}
										</Typography>
										<Button
											variant='outlined'
											color={card.color as any}
											size='small'
											sx={{ mt: 1, borderRadius: 2 }}
											onClick={e => {
												e.stopPropagation()
												navigate(card.to)
											}}
										>
											进入
										</Button>
									</Stack>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default Dashboard
