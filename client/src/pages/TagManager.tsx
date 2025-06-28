import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { fetchTags, createTag, updateTag, deleteTag } from "@/store/slices/tagsSlice"
import { Tag } from "@/types"
import {
	Box,
	Typography,
	Button,
	Stack,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Chip,
	Grid,
	Tooltip,
	InputAdornment
} from "@mui/material"
import { Add, Edit, Delete, Palette } from "@mui/icons-material"

const COLOR_PRESETS = ["#4361ee", "#f72585", "#3bb273", "#ffb703", "#ff6d00", "#00b4d8", "#7209b7", "#22223b"]

const TagManager: React.FC = () => {
	const dispatch = useDispatch()
	const { items: tags, loading } = useSelector((state: RootState) => state.tags)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editData, setEditData] = useState<Tag | null>(null)
	const [form, setForm] = useState<{ name: string; desc: string; color: string }>({ name: "", desc: "", color: COLOR_PRESETS[0] })
	const [error, setError] = useState("")

	useEffect(() => {
		dispatch(fetchTags())
	}, [dispatch])

	const handleOpen = (tag?: Tag) => {
		if (tag) {
			setEditData(tag)
			setForm({ name: tag.name, desc: tag.desc || "", color: tag.color || COLOR_PRESETS[0] })
		} else {
			setEditData(null)
			setForm({ name: "", desc: "", color: COLOR_PRESETS[0] })
		}
		setError("")
		setDialogOpen(true)
	}

	const handleClose = () => {
		setDialogOpen(false)
		setError("")
	}

	const handleChange = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

	const handleSubmit = () => {
		if (!form.name.trim()) {
			setError("标签名称不能为空")
			return
		}
		if (tags.some(t => t.name === form.name.trim() && (!editData || t._id !== editData._id))) {
			setError("标签名称已存在")
			return
		}
		if (editData) {
			dispatch(updateTag({ id: editData._id, data: form }) as any)
		} else {
			dispatch(createTag(form) as any)
		}
		setDialogOpen(false)
	}

	const handleDelete = (id: string) => {
		if (window.confirm("确定要删除该标签吗？")) {
			dispatch(deleteTag(id) as any)
		}
	}

	return (
		<Box>
			<Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
				<Typography variant='h4'>标签管理</Typography>
				<Button variant='contained' startIcon={<Add />} onClick={() => handleOpen()}>
					新增标签
				</Button>
			</Box>
			<Grid container spacing={2}>
				{tags.map(tag => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={tag._id}>
						<Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2 }}>
							<Chip label={tag.name} sx={{ bgcolor: tag.color, color: "#fff", fontWeight: 600, fontSize: 16 }} />
							<Typography variant='body2' color='text.secondary' flex={1}>
								{tag.desc}
							</Typography>
							<Tooltip title='编辑'>
								<IconButton onClick={() => handleOpen(tag)}>
									<Edit />
								</IconButton>
							</Tooltip>
							<Tooltip title='删除'>
								<IconButton color='error' onClick={() => handleDelete(tag._id)}>
									<Delete />
								</IconButton>
							</Tooltip>
						</Box>
					</Grid>
				))}
			</Grid>
			<Dialog open={dialogOpen} onClose={handleClose} maxWidth='xs' fullWidth>
				<DialogTitle>{editData ? "编辑标签" : "新增标签"}</DialogTitle>
				<DialogContent>
					<Stack spacing={2} mt={1}>
						<TextField label='标签名称' value={form.name} onChange={e => handleChange("name", e.target.value)} required fullWidth autoFocus />
						<TextField label='标签描述' value={form.desc} onChange={e => handleChange("desc", e.target.value)} fullWidth multiline rows={2} />
						<Box>
							<Typography variant='subtitle2' mb={1}>
								标签颜色
							</Typography>
							<Stack direction='row' spacing={1}>
								{COLOR_PRESETS.map(c => (
									<IconButton
										key={c}
										onClick={() => handleChange("color", c)}
										sx={{ bgcolor: c, border: form.color === c ? "2px solid #222" : "2px solid transparent" }}
									>
										<Palette sx={{ color: "#fff" }} />
									</IconButton>
								))}
								<TextField
									size='small'
									value={form.color}
									onChange={e => handleChange("color", e.target.value)}
									sx={{ width: 90 }}
									InputProps={{ startAdornment: <InputAdornment position='start'>#</InputAdornment> }}
								/>
							</Stack>
						</Box>
						{error && <Typography color='error'>{error}</Typography>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>取消</Button>
					<Button variant='contained' onClick={handleSubmit}>
						{editData ? "保存" : "添加"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default TagManager
