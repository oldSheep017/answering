import React, { useState, useEffect } from "react"
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Stack,
	MenuItem,
	Chip,
	Box,
	Select,
	InputLabel,
	FormControl,
	Typography
} from "@mui/material"
import { Question } from "@/types"
import { useSelector, useDispatch } from "react-redux"
import { fetchTags } from "@/store/slices/tagsSlice"
import { RootState } from "@/store"

const TAG_OPTIONS = ["数学", "英语", "编程", "前端", "后端", "算法", "数据库", "网络"]

interface QuestionFormProps {
	open: boolean
	onClose: () => void
	onSubmit: (data: Partial<Question> & { options?: string[] }) => void
	initial?: Partial<Question>
}

/**
 * 题目新增/编辑表单组件
 */
const QuestionForm: React.FC<QuestionFormProps> = ({ open, onClose, onSubmit, initial }) => {
	const [type, setType] = useState<"choice" | "fill">(initial?.type || "choice")
	const [title, setTitle] = useState(initial?.title || "")
	const [options, setOptions] = useState<string[]>(initial?.options || ["", "", "", ""])
	const [answer, setAnswer] = useState(initial?.answer || "")
	const [tags, setTags] = useState<string[]>(initial?.tags || [])
	const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(initial?.difficulty || "medium")
	const [error, setError] = useState("")
	const dispatch = useDispatch()
	const tagsList = useSelector((state: RootState) => state.tags.items)

	useEffect(() => {
		if (open) {
			setType(initial?.type || "choice")
			setTitle(initial?.title || "")
			setOptions(initial?.options || ["", "", "", ""])
			setAnswer(initial?.answer || "")
			setTags(initial?.tags || [])
			setDifficulty(initial?.difficulty || "medium")
			setError("")
		}
		dispatch(fetchTags())
		// eslint-disable-next-line
	}, [open, initial, dispatch])

	const handleOptionChange = (idx: number, value: string) => {
		const newOpts = [...options]
		newOpts[idx] = value
		setOptions(newOpts)
	}

	const handleAddOption = () => {
		if (options.length < 8) {
			setOptions([...options, ""])
		}
	}

	const handleRemoveOption = (idx: number) => {
		if (options.length > 2) {
			const newOpts = options.filter((_, i) => i !== idx)
			setOptions(newOpts)
			if (options[idx] === answer) setAnswer("")
		}
	}

	const handleSubmit = () => {
		if (!title.trim()) {
			setError("题干不能为空")
			return
		}
		if (type === "choice") {
			if (options.length < 2) {
				setError("选择题至少需要2个选项")
				return
			}
			if (options.some(opt => !opt.trim())) {
				setError("所有选项都不能为空")
				return
			}
			if (!options.includes(answer)) {
				setError("正确答案必须是选项之一")
				return
			}
		} else {
			if (!answer.trim()) {
				setError("标准答案不能为空")
				return
			}
		}
		setError("")
		onSubmit({ type, title, options: type === "choice" ? options : [], answer, tags, difficulty })
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>{initial?._id ? "编辑题目" : "新增题目"}</DialogTitle>
			<DialogContent>
				<Stack spacing={2} mt={1}>
					<FormControl fullWidth>
						<InputLabel>题型</InputLabel>
						<Select value={type} label='题型' onChange={e => setType(e.target.value as any)}>
							<MenuItem value='choice'>选择题</MenuItem>
							<MenuItem value='fill'>填空题</MenuItem>
						</Select>
					</FormControl>
					<TextField label='题干' value={title} onChange={e => setTitle(e.target.value)} fullWidth required />
					{type === "choice" && (
						<Stack spacing={1}>
							{options.map((opt, idx) => (
								<Box key={idx} display='flex' alignItems='center' gap={1}>
									<TextField
										label={`选项${String.fromCharCode(65 + idx)}`}
										value={opt}
										onChange={e => handleOptionChange(idx, e.target.value)}
										required
										sx={{ flex: 1 }}
									/>
									{options.length > 2 && (
										<Button color='error' onClick={() => handleRemoveOption(idx)} size='small'>
											删除
										</Button>
									)}
								</Box>
							))}
							<Button onClick={handleAddOption} disabled={options.length >= 8} size='small' sx={{ alignSelf: "flex-start", mt: 1 }}>
								添加选项
							</Button>
							<FormControl fullWidth>
								<InputLabel>正确答案</InputLabel>
								<Select value={answer} label='正确答案' onChange={e => setAnswer(e.target.value)}>
									{options.map((opt, idx) => (
										<MenuItem key={idx} value={opt}>
											{opt || `选项${String.fromCharCode(65 + idx)}`}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					)}
					{type === "fill" && <TextField label='标准答案' value={answer} onChange={e => setAnswer(e.target.value)} required />}
					<FormControl fullWidth>
						<InputLabel>标签</InputLabel>
						<Select
							multiple
							value={tags}
							label='标签'
							onChange={e => setTags(e.target.value as string[])}
							renderValue={selected =>
								(selected as string[])
									.map(t => {
										const tagObj = tagsList.find(tag => tag._id === t)
										return tagObj ? tagObj.name : t
									})
									.join(", ")
							}
						>
							{tagsList.map(tag => (
								<MenuItem key={tag._id} value={tag._id}>
									<Box display='inline-flex' alignItems='center' gap={1}>
										<span style={{ display: "inline-block", width: 14, height: 14, background: tag.color, borderRadius: 3, marginRight: 4 }} />
										{tag.name}
									</Box>
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel>难度</InputLabel>
						<Select value={difficulty} label='难度' onChange={e => setDifficulty(e.target.value as any)}>
							<MenuItem value='easy'>简单</MenuItem>
							<MenuItem value='medium'>中等</MenuItem>
							<MenuItem value='hard'>困难</MenuItem>
						</Select>
					</FormControl>
					{error && <Typography color='error'>{error}</Typography>}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>取消</Button>
				<Button variant='contained' onClick={handleSubmit}>
					{initial?._id ? "保存" : "新增"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default QuestionForm
