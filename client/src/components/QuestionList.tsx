import React, { useEffect, useState } from "react"
import {
	Box,
	Typography,
	Card,
	CardContent,
	Chip,
	Stack,
	IconButton,
	Button,
	Grid,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Pagination,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from "@mui/material"
import { Delete, Edit, FilterList, Download, Upload } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { fetchQuestions, deleteQuestion, fetchQuestionStats } from "@/store/slices/questionsSlice"
import { fetchTags } from "@/store/slices/tagsSlice"
import { Question } from "@/types"

interface QuestionListProps {
	onEdit: (question: Question) => void
	onImport: () => void
	onExport: () => void
	defaultType?: string
}

/**
 * 题目列表组件
 */
const QuestionList: React.FC<QuestionListProps> = ({ onEdit, onImport, onExport, defaultType = "" }) => {
	const dispatch = useDispatch<AppDispatch>()
	const { items, loading, pagination, stats } = useSelector((state: RootState) => state.questions)
	const { items: tags } = useSelector((state: RootState) => state.tags)
	const [search, setSearch] = useState("")
	const [type, setType] = useState<"choice" | "fill" | "">(defaultType as "choice" | "fill" | "")
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">("")
	const [tag, setTag] = useState("")
	const [page, setPage] = useState(1)
	const [deleteId, setDeleteId] = useState<string | null>(null)

	useEffect(() => {
		setType(defaultType as "choice" | "fill" | "")
	}, [defaultType])

	useEffect(() => {
		dispatch(
			fetchQuestions({
				page,
				search,
				type: type || undefined,
				difficulty: difficulty || undefined,
				tags: tag || undefined
			})
		)
		// eslint-disable-next-line
	}, [page, search, type, difficulty, tag])

	useEffect(() => {
		dispatch(fetchQuestionStats())
		dispatch(fetchTags())
		// eslint-disable-next-line
	}, [])

	const handleDelete = (id: string) => {
		setDeleteId(id)
	}

	const confirmDelete = () => {
		if (deleteId) {
			dispatch(deleteQuestion(deleteId))
			setDeleteId(null)
		}
	}

	// 获取标签名称
	const getTagName = (tagId: string) => {
		const tag = tags.find(t => t._id === tagId)
		return tag ? tag.name : tagId
	}

	// 获取标签颜色
	const getTagColor = (tagId: string) => {
		const tag = tags.find(t => t._id === tagId)
		return tag ? tag.color : undefined
	}

	return (
		<Box>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems='center'>
				<TextField label='搜索题干/标签' value={search} onChange={e => setSearch(e.target.value)} size='small' sx={{ minWidth: 180 }} />
				<FormControl size='small' sx={{ minWidth: 120 }}>
					<InputLabel>题型</InputLabel>
					<Select value={type} label='题型' onChange={e => setType(e.target.value as "choice" | "fill" | "")}>
						<MenuItem value=''>全部</MenuItem>
						<MenuItem value='choice'>选择题</MenuItem>
						<MenuItem value='fill'>填空题</MenuItem>
					</Select>
				</FormControl>
				<FormControl size='small' sx={{ minWidth: 120 }}>
					<InputLabel>难度</InputLabel>
					<Select value={difficulty} label='难度' onChange={e => setDifficulty(e.target.value as "easy" | "medium" | "hard" | "")}>
						<MenuItem value=''>全部</MenuItem>
						<MenuItem value='easy'>简单</MenuItem>
						<MenuItem value='medium'>中等</MenuItem>
						<MenuItem value='hard'>困难</MenuItem>
					</Select>
				</FormControl>
				<FormControl size='small' sx={{ minWidth: 120 }}>
					<InputLabel>标签</InputLabel>
					<Select value={tag} label='标签' onChange={e => setTag(e.target.value)}>
						<MenuItem value=''>全部</MenuItem>
						{tags.map(t => (
							<MenuItem key={t._id} value={t._id}>
								<Box display='inline-flex' alignItems='center' gap={1}>
									<span style={{ display: "inline-block", width: 14, height: 14, background: t.color, borderRadius: 3, marginRight: 4 }} />
									{t.name}
								</Box>
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Tooltip title='批量导入题库'>
					<IconButton color='primary' onClick={onImport}>
						<Upload />
					</IconButton>
				</Tooltip>
				<Tooltip title='导出题库'>
					<IconButton color='primary' onClick={onExport}>
						<Download />
					</IconButton>
				</Tooltip>
			</Stack>
			<Grid container spacing={2}>
				{items.map(q => (
					<Grid item xs={12} md={6} lg={4} key={q._id}>
						<Card sx={{ borderRadius: 2, boxShadow: 2, position: "relative" }}>
							<CardContent>
								<Stack direction='row' spacing={1} alignItems='center' mb={1}>
									<Chip label={q.type === "choice" ? "选择题" : "填空题"} color={q.type === "choice" ? "primary" : "success"} size='small' />
									{q.tags.map(tag => {
										const tagName = typeof tag === "string" ? getTagName(tag) : tag.name
										const tagColor = typeof tag === "string" ? getTagColor(tag) : tag.color
										return (
											<Chip
												key={typeof tag === "string" ? tag : tag._id}
												label={tagName}
												size='small'
												variant='outlined'
												sx={{
													bgcolor: tagColor,
													color: "#fff",
													borderColor: tagColor,
													"&:hover": { bgcolor: tagColor }
												}}
											/>
										)
									})}
									<Chip label={q.difficulty === "easy" ? "简单" : q.difficulty === "medium" ? "中等" : "困难"} size='small' color='secondary' />
								</Stack>
								<Typography variant='subtitle1' gutterBottom noWrap>
									{q.title}
								</Typography>
								{q.type === "choice" && (
									<Stack direction='row' spacing={1} mb={1}>
										{q.options.map((opt, idx) => (
											<Chip
												key={idx}
												label={opt}
												size='small'
												variant={opt === q.answer ? "filled" : "outlined"}
												color={opt === q.answer ? "primary" : "default"}
											/>
										))}
									</Stack>
								)}
								<Typography variant='body2' color='text.secondary' noWrap>
									答案：{q.answer}
								</Typography>
								<Stack direction='row' spacing={1} mt={2}>
									<Button size='small' variant='outlined' onClick={() => onEdit(q)} startIcon={<Edit />}>
										编辑
									</Button>
									<Button size='small' variant='outlined' color='error' onClick={() => handleDelete(q._id)} startIcon={<Delete />}>
										删除
									</Button>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
			<Box mt={3} display='flex' justifyContent='center'>
				<Pagination count={pagination.pages} page={pagination.page} onChange={(_, value) => setPage(value)} color='primary' />
			</Box>
			{/* 删除确认对话框 */}
			<Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
				<DialogTitle>确认删除</DialogTitle>
				<DialogContent>确定要删除这道题目吗？此操作不可恢复。</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteId(null)}>取消</Button>
					<Button color='error' onClick={confirmDelete}>
						删除
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default QuestionList
