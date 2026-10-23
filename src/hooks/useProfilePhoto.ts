import { useMutation } from '@tanstack/react-query'
import { deleteProfilePhoto, uploadProfilePhoto } from '@/services/profilePhoto'

export function useUploadProfilePhoto() {
  return useMutation({
    mutationFn: (file: File) => uploadProfilePhoto(file),
  })
}

export function useDeleteProfilePhoto() {
  return useMutation({
    mutationFn: () => deleteProfilePhoto(),
  })
}
