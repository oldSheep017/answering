import React, { useRef, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from "@mui/material"

interface QuestionImportDialogProps {
	open: boolean
	onClose: () => void
	onImport: (data: any[]) => void
}

/**
 * 题库批量导入对话框组件
 */
const QuestionImportDialog: React.FC<QuestionImportDialogProps> = ({ open, onClose, onImport }) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState("")

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = evt => {
			try {
				const json = JSON.parse(evt.target?.result as string)
				if (!Array.isArray(json.questions)) {
					setError("文件格式错误，必须包含 questions 数组")
					return
				}
				setError("")
				onImport(json.questions)
				onClose()
			} catch (err) {
				setError("解析 JSON 文件失败，请检查格式")
			}
		}
		reader.readAsText(file, "utf-8")
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
			<DialogTitle>批量导入题库</DialogTitle>
			<DialogContent>
				<Typography variant='body2' mb={2}>
					请选择包含 <b>questions</b> 数组的 JSON 文件进行导入。
				</Typography>
				<Box display='flex' justifyContent='center' alignItems='center' minHeight={80}>
					<Button variant='contained' component='label' color='primary'>
						选择文件
						<input type='file' accept='application/json' hidden ref={fileInputRef} onChange={handleFileChange} />
					</Button>
				</Box>
				{error && (
					<Alert severity='error' sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>取消</Button>
			</DialogActions>
		</Dialog>
	)
}

export default QuestionImportDialog
