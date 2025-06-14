// src/store/department/departmentApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import createBaseQueryWithReauth from "../baseApi/baseQueryWithReauth";

export interface Department {
  id: number;
  name: string;
}

const baseQueryWithReauth = createBaseQueryWithReauth(
  'http://localhost:8000/api/classroom',
)

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Department"],
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "/department/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Department" as const, id })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),
    getDepartmentById: builder.query<Department, number>({
      query: (id) => `/department/${id}/`,
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({
        url: "/department/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),
    updateDepartment: builder.mutation<Department, Partial<Department>>({
      query: ({ id, ...patch }) => ({
        url: `/department/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),
    deleteDepartment: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/department/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
