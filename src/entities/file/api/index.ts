import { AxiosProgressEvent } from 'axios'
import axios from 'shared/api/axios'

export function postFiles(
  files: File[],
  onProgress: (progressEvent: AxiosProgressEvent) => void
) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  return axios.post('/api/v1/image/upload', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  })
}

export function getHistory() {
  return axios.get('/api/v1/image/all', {
    withCredentials: true,
  })
}

export function getPhoto(id: number) {
  return axios.get(`/api/v1/image/${id}/`, {
    withCredentials: true,
  })
}

export function deletePhoto(id: number) {
  return axios.delete(`/api/v1/image/${id}/`, {
    withCredentials: true,
  })
}

export function postClass(
  files: File[],
  onProgress: (progressEvent: AxiosProgressEvent) => void
) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  return axios.post('/api/v1/class/create', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  })
}

export function getClasses() {
  return axios.get('/api/v1/class/all', {
    withCredentials: true,
  })
}

export function deleteClass(id: number) {
  return axios.delete(`/api/v1/class/${id}/`, {
    withCredentials: true,
  })
}
