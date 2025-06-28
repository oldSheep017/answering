import React, { Component, ErrorInfo, ReactNode } from "react"
import { Box, Typography, Button, Container, Paper } from "@mui/material"
import { Error as ErrorIcon } from "@mui/icons-material"

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

/**
 * 错误边界组件
 * 捕获子组件中的 JavaScript 错误
 */
class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("错误边界捕获到错误:", error, errorInfo)
	}

	handleReload = () => {
		window.location.reload()
	}

	render() {
		if (this.state.hasError) {
			return (
				<Container maxWidth='sm'>
					<Box
						sx={{
							minHeight: "100vh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Paper
							elevation={3}
							sx={{
								p: 4,
								textAlign: "center",
								borderRadius: 2
							}}
						>
							<ErrorIcon
								sx={{
									fontSize: 64,
									color: "error.main",
									mb: 2
								}}
							/>
							<Typography variant='h4' gutterBottom>
								出错了！
							</Typography>
							<Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
								应用程序遇到了一个意外错误。请尝试刷新页面或联系管理员。
							</Typography>
							{process.env.NODE_ENV === "development" && this.state.error && (
								<Box
									sx={{
										bgcolor: "grey.100",
										p: 2,
										borderRadius: 1,
										mb: 3,
										textAlign: "left"
									}}
								>
									<Typography variant='body2' fontFamily='monospace'>
										{this.state.error.message}
									</Typography>
								</Box>
							)}
							<Button variant='contained' onClick={this.handleReload} sx={{ mr: 2 }}>
								刷新页面
							</Button>
							<Button variant='outlined' onClick={() => window.history.back()}>
								返回上页
							</Button>
						</Paper>
					</Box>
				</Container>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
