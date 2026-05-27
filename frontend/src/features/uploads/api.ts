import { apiClient } from '@shared/api/client'

export async function uploadCustomizationFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<{ url: string }>('/uploads/customization', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}
