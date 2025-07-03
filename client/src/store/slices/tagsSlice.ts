import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Tag } from "@/types"
import api from "@/services/api"

// 获取所有标签
export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
	return await api.getTags()
})

// 新建标签
export const createTag = createAsyncThunk("tags/createTag", async (data: { name: string; desc?: string; color?: string }) => {
	return await api.createTag(data)
})

// 编辑标签
export const updateTag = createAsyncThunk(
	"tags/updateTag",
	async ({ id, data }: { id: string; data: { name: string; desc?: string; color?: string } }) => {
		return await api.updateTag(id, data)
	}
)

// 删除标签
export const deleteTag = createAsyncThunk("tags/deleteTag", async (id: string) => {
	await api.deleteTag(id)
	return id
})

interface TagsState {
	items: Tag[]
	loading: boolean
	error: string | null
}

const initialState: TagsState = {
	items: [],
	loading: false,
	error: null
}

const tagsSlice = createSlice({
	name: "tags",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTags.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload
			})
			.addCase(fetchTags.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "获取标签失败"
			})
			.addCase(createTag.fulfilled, (state, action) => {
				state.items.unshift(action.payload)
			})
			.addCase(updateTag.fulfilled, (state, action) => {
				const idx = state.items.findIndex(t => t._id === action.payload._id)
				if (idx !== -1) state.items[idx] = action.payload
			})
			.addCase(deleteTag.fulfilled, (state, action) => {
				state.items = state.items.filter(t => t._id !== action.payload)
			})
	}
})

export default tagsSlice.reducer
