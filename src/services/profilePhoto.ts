import apiClient from '@/api/client'
import type { ApiResponse } from '@/types'

export interface ProfilePhotoResponse {
  url: string
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  const response = await apiClient.post<ApiResponse<ProfilePhotoResponse>>(
    '/profile/photo',
    formData,
    {
      baseURL: '/api',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data.data
}

export async function deleteProfilePhoto() {
  await apiClient.delete('/profile/photo', {
    baseURL: '/api',
  })
}
