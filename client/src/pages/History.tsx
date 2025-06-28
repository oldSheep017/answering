import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { fetchHistory, setHistoryQuery } from "@/store/slices/historySlice"
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Stack,
	TextField,
	Button
} from "@mui/material"
import dayjs from "dayjs"

const SORT_FIELDS = [
	{ value: "createdAt", label: "日期" },
	{ value: "score", label: "分数" },
	{ value: "duration", label: "用时" }
]

/**
 * 历史记录页面组件
 */
const History: React.FC = () => {
	const dispatch = useDispatch()
	const { items, pagination, loading, query } = useSelector((state: RootState) => state.history)
	const [startDate, setStartDate] = React.useState("")
	const [endDate, setEndDate] = React.useState("")

	useEffect(() => {
		dispatch(fetchHistory(query) as any)
	}, [dispatch, query])

	const handlePageChange = (_: any, newPage: number) => {
		dispatch(setHistoryQuery({ page: newPage + 1 }))
	}

	const handleRowsPerPageChange = (e: any) => {
		dispatch(setHistoryQuery({ limit: parseInt(e.target.value, 10), page: 1 }))
	}

	const handleSortChange = (e: any) => {
		dispatch(setHistoryQuery({ sortBy: e.target.value }))
	}

	const handleSortOrderChange = (e: any) => {
		dispatch(setHistoryQuery({ sortOrder: e.target.value }))
	}

	const handleDateFilter = () => {
		dispatch(setHistoryQuery({ startDate, endDate, page: 1 }))
	}

	return (
		<Box>
			<Typography variant='h4' mb={2}>
				历史记录
			</Typography>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems='center'>
				<FormControl size='small' sx={{ minWidth: 120 }}>
					<InputLabel>排序字段</InputLabel>
					<Select value={query.sortBy || "createdAt"} label='排序字段' onChange={handleSortChange}>
						{SORT_FIELDS.map(f => (
							<MenuItem key={f.value} value={f.value}>
								{f.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl size='small' sx={{ minWidth: 120 }}>
					<InputLabel>排序方式</InputLabel>
					<Select value={query.sortOrder || "desc"} label='排序方式' onChange={handleSortOrderChange}>
						<MenuItem value='desc'>降序</MenuItem>
						<MenuItem value='asc'>升序</MenuItem>
					</Select>
				</FormControl>
				<TextField
					label='起始日期'
					type='date'
					size='small'
					value={startDate}
					onChange={e => setStartDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					label='结束日期'
					type='date'
					size='small'
					value={endDate}
					onChange={e => setEndDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>
				<Button variant='outlined' onClick={handleDateFilter}>
					筛选
				</Button>
			</Stack>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>日期</TableCell>
						<TableCell>分数</TableCell>
						<TableCell>总题数</TableCell>
						<TableCell>用时(秒)</TableCell>
						<TableCell>操作</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{items.map(item => (
						<TableRow key={item._id}>
							<TableCell>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
							<TableCell>{item.score}</TableCell>
							<TableCell>{item.total}</TableCell>
							<TableCell>{item.duration}</TableCell>
							<TableCell>
								<Button size='small' variant='outlined' href={`/history/${item._id}`}>
									详情
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				component='div'
				count={pagination.total}
				page={pagination.page - 1}
				onPageChange={handlePageChange}
				rowsPerPage={pagination.limit}
				onRowsPerPageChange={handleRowsPerPageChange}
				rowsPerPageOptions={[5, 10, 20, 50]}
			/>
		</Box>
	)
}

export default History
