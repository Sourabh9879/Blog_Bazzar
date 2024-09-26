import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogApi = createApi({
    reducerPath: 'blogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        credentials:'include'
    }),
    tagTypes: ['Blogs'],
    endpoints: (builder) => (
        {
            fetchBlogs: builder.query({
                query: ({ search = '', category = '', location = '' }) => `/blogs?search=${search}&category=${category}&location=${location}`,
                providesTags: ['Blogs']
            }),
            fetchBlogsById: builder.query({
                query: (id) => `/blogs/${id}`
            }),
            fetchRelatedBlogs: builder.query({
                query: (id) => `/blogs/related/${id}`
            }),
            postBlog: builder.mutation({
                query:(newBlog) => ({
                    url: `/blogs/create-post`,
                    method: "POST",
                    body: newBlog,
                    credentials: "include",
                }),
                invalidatesTags: [`Blogs`]
            }),
            updateBlog: builder.mutation({
                query:({id, ...rest}) => ({
                    url: `/blogs/update-post/${id}`,
                    method: "PATCH",
                    body: rest,
                    credentials: "include",
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Blogs', id}],
            }),
            deleteBlog: builder.mutation({
                query:(id) => ({
                    url: `/blogs/${id}`,
                    method: "DELETE",
                    credentials: "include",
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Blogs', id}],
            }),
            likeBlog: builder.mutation({
                query: (id) => ({
                    url: `/blogs/like/${id}`,
                    method: 'PATCH',
                    credentials: 'include',
                }),
                invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }],
            }),
            dislikeBlog: builder.mutation({
                query: (id) => ({
                    url: `/blogs/dislike/${id}`,
                    method: 'PATCH',
                    credentials: 'include',
                }),
                invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }],
            }),
            sendEmail: builder.mutation({
                query: (emailData) => ({
                    url: '/blogs/send-email',
                    method: 'POST',
                    body: emailData,
                }),
            }),
        }
    )
})
export const {useFetchBlogsQuery, useFetchBlogsByIdQuery, useFetchRelatedBlogsQuery, usePostBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation,useLikeBlogMutation,useDislikeBlogMutation, useSendEmailMutation} = blogApi;