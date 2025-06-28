import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from "@mui/material"

interface QuestionExportDialogProps {
	open: boolean
	onClose: () => void
	questions: any[]
}

/**
 * 题库导出对话框组件
 */
const QuestionExportDialog: React.FC<QuestionExportDialogProps> = ({ open, onClose, questions }) => {
	const handleDownload = () => {
		const data = JSON.stringify({ questions }, null, 2)
		const blob = new Blob([data], { type: "application/json" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `questions-export-${Date.now()}.json`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
			<DialogTitle>导出题库</DialogTitle>
			<DialogContent>
				<Typography variant='body2' mb={2}>
					点击下方按钮可导出当前题库为 JSON 文件。
				</Typography>
				<Box display='flex' justifyContent='center' alignItems='center' minHeight={80}>
					<Button variant='contained' color='primary' onClick={handleDownload}>
						下载 JSON 文件
					</Button>
				</Box>
				{questions.length === 0 && (
					<Alert severity='warning' sx={{ mt: 2 }}>
						当前题库为空
					</Alert>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>关闭</Button>
			</DialogActions>
		</Dialog>
	)
}

export default QuestionExportDialog
