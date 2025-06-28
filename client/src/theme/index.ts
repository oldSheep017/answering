import { createTheme } from "@mui/material/styles"

/**
 * 自定义主题配置
 * 使用主色 #4361ee
 */
export const theme = createTheme({
	palette: {
		primary: {
			main: "#4361ee",
			light: "#6b7cff",
			dark: "#2a3eb1",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#f72585",
			light: "#ff5983",
			dark: "#c40055",
			contrastText: "#ffffff"
		},
		background: {
			default: "#f8f9fa",
			paper: "#ffffff"
		},
		text: {
			primary: "#2d3748",
			secondary: "#718096"
		}
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
			lineHeight: 1.2
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
			lineHeight: 1.3
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 600,
			lineHeight: 1.4
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: 600,
			lineHeight: 1.4
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: 600,
			lineHeight: 1.4
		},
		h6: {
			fontSize: "1rem",
			fontWeight: 600,
			lineHeight: 1.4
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.6
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 1.6
		}
	},
	shape: {
		borderRadius: 12
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
					fontWeight: 600,
					padding: "8px 24px"
				},
				contained: {
					boxShadow: "0 2px 8px rgba(67, 97, 238, 0.3)",
					"&:hover": {
						boxShadow: "0 4px 12px rgba(67, 97, 238, 0.4)"
					}
				}
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
					border: "1px solid rgba(0, 0, 0, 0.04)"
				}
			}
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 12
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 8
					}
				}
			}
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					fontWeight: 500
				}
			}
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					borderRadius: 0
				}
			}
		}
	}
})

/**
 * 深色主题配置
 */
export const darkTheme = createTheme({
	...theme,
	palette: {
		mode: "dark",
		primary: {
			main: "#4361ee",
			light: "#6b7cff",
			dark: "#2a3eb1",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#f72585",
			light: "#ff5983",
			dark: "#c40055",
			contrastText: "#ffffff"
		},
		background: {
			default: "#0f1419",
			paper: "#1a202c"
		},
		text: {
			primary: "#f7fafc",
			secondary: "#a0aec0"
		}
	},
	components: {
		...theme.components,
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
					border: "1px solid rgba(255, 255, 255, 0.08)"
				}
			}
		}
	}
})
