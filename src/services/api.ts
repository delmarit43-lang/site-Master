import apiClient from '@/api/client'
import type { ApiResponse, ListParams, PaginationMeta } from '@/types'

export async function fetchList<T>(
  endpoint: string,
  params?: ListParams
): Promise<{ data: T[]; meta: PaginationMeta }> {
  const response = await apiClient.get<ApiResponse<T[]>>(endpoint, {
    params: {
      page: params?.page ?? 1,
      per_page: params?.perPage ?? 10,
      search: params?.search,
      sort_by: params?.sortBy,
      sort_order: params?.sortOrder,
      ...params?.filters,
    },
  })

  return {
    data: response.data.data ?? [],
    meta: response.data.meta ?? {
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0,
    },
  }
}

export async function fetchOne<T>(endpoint: string, id: string): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(`${endpoint}/${id}`)
  return response.data.data
}

export async function createOne<T, P>(endpoint: string, payload: P): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, payload)
  return response.data.data
}

export async function updateOne<T, P>(
  endpoint: string,
  id: string,
  payload: P
): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(`${endpoint}/${id}`, payload)
  return response.data.data
}

export async function deleteOne(endpoint: string, id: string): Promise<void> {
  await apiClient.delete(`${endpoint}/${id}`)
}
