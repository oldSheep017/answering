import React, { useState, useEffect } from "react"
import { Box, Button, Typography } from "@mui/material"
import { useSearchParams } from "react-router-dom"
import QuestionList from "@/components/QuestionList"
import QuestionForm from "@/components/QuestionForm"
import QuestionImportDialog from "@/components/QuestionImportDialog"
import QuestionExportDialog from "@/components/QuestionExportDialog"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { createQuestion, updateQuestion, importQuestions, fetchQuestions, fetchQuestionStats } from "@/store/slices/questionsSlice"
import { Question } from "@/types"

/**
 * 题目管理页面组件
 */
const Questions: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { items } = useSelector((state: RootState) => state.questions)
	const [searchParams] = useSearchParams()
	const [formOpen, setFormOpen] = useState(false)
	const [editData, setEditData] = useState<Question | null>(null)
	const [importOpen, setImportOpen] = useState(false)
	const [exportOpen, setExportOpen] = useState(false)

	// 从URL参数获取默认题型筛选
	const defaultType = searchParams.get("type") || ""

	// 新增题目
	const handleAdd = () => {
		setEditData(null)
		setFormOpen(true)
	}

	// 编辑题目
	const handleEdit = (q: Question) => {
		setEditData(q)
		setFormOpen(true)
	}

	// 提交表单
	const handleSubmit = (data: Partial<Question> & { options?: string[] }) => {
		const submitData = {
			type: data.type as "choice" | "fill",
			title: data.title || "",
			options: data.options,
			answer: data.answer || "",
			tags: (data.tags || []).map(t => (typeof t === "string" ? t : t._id)),
			difficulty: (data.difficulty as "easy" | "medium" | "hard") || "medium"
		}
		if (editData && editData._id) {
			dispatch(updateQuestion({ id: editData._id, data: submitData }))
		} else {
			dispatch(createQuestion(submitData)).then(() => {
				dispatch(fetchQuestionStats())
			})
		}
		setFormOpen(false)
	}

	// 批量导入
	const handleImport = (questions: any[]) => {
		dispatch(importQuestions(questions)).then(() => {
			dispatch(fetchQuestionStats())
		})
		setImportOpen(false)
		setTimeout(() => dispatch(fetchQuestions({})), 500)
	}

	// 批量导出
	const handleExport = () => {
		setExportOpen(true)
	}

	return (
		<Box>
			<Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
				<Typography variant='h4'>题目管理</Typography>
				<Button variant='contained' color='primary' onClick={handleAdd}>
					新增题目
				</Button>
			</Box>
			<QuestionList onEdit={handleEdit} onImport={() => setImportOpen(true)} onExport={handleExport} defaultType={defaultType} />
			<QuestionForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initial={editData || undefined} />
			<QuestionImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
			<QuestionExportDialog open={exportOpen} onClose={() => setExportOpen(false)} questions={items} />
		</Box>
	)
}

export default Questions
