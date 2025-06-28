import React, { useState } from "react"
import { Box, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, TextField, Typography, Stack } from "@mui/material"
import { TestConfig } from "@/types"

const TAG_OPTIONS = ["数学", "英语", "编程", "前端", "后端", "算法", "数据库", "网络"]

interface TestConfigFormProps {
	loading?: boolean
	onStart: (config: TestConfig) => void
}

/**
 * 自测配置表单组件
 */
const TestConfigForm: React.FC<TestConfigFormProps> = ({ loading, onStart }) => {
	const [questionCount, setQuestionCount] = useState(10)
	const [types, setTypes] = useState<("choice" | "fill")[]>(["choice", "fill"])
	const [tags, setTags] = useState<string[]>([])
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onStart({
			questionCount,
			types,
			tags,
			difficulty: difficulty || undefined
		})
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 2 }}
		>
			<Typography variant='h5' gutterBottom align='center'>
				自测配置
			</Typography>
			<Stack spacing={2}>
				<TextField
					label='题目数量'
					type='number'
					value={questionCount}
					onChange={e => setQuestionCount(Math.max(1, Math.min(50, Number(e.target.value))))}
					inputProps={{ min: 1, max: 50 }}
					required
					fullWidth
				/>
				<FormControl fullWidth>
					<InputLabel>题型</InputLabel>
					<Select
						multiple
						value={types}
						onChange={e => setTypes(e.target.value as any)}
						input={<OutlinedInput label='题型' />}
						renderValue={selected => (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{(selected as string[]).map(value => (
									<Chip key={value} label={value === "choice" ? "选择题" : "填空题"} />
								))}
							</Box>
						)}
					>
						<MenuItem value='choice'>选择题</MenuItem>
						<MenuItem value='fill'>填空题</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel>标签（可多选）</InputLabel>
					<Select
						multiple
						value={tags}
						onChange={e => setTags(e.target.value as string[])}
						input={<OutlinedInput label='标签（可多选）' />}
						renderValue={selected => (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{(selected as string[]).map(value => (
									<Chip key={value} label={value} />
								))}
							</Box>
						)}
					>
						{TAG_OPTIONS.map(tag => (
							<MenuItem key={tag} value={tag}>
								{tag}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel>难度</InputLabel>
					<Select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} label='难度'>
						<MenuItem value=''>不限</MenuItem>
						<MenuItem value='easy'>简单</MenuItem>
						<MenuItem value='medium'>中等</MenuItem>
						<MenuItem value='hard'>困难</MenuItem>
					</Select>
				</FormControl>
				<Button type='submit' variant='contained' color='primary' size='large' fullWidth disabled={loading}>
					{loading ? "生成试卷中..." : "开始测试"}
				</Button>
			</Stack>
		</Box>
	)
}

export default TestConfigForm
