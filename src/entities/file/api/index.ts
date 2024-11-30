import axios from 'shared/api/axios'

export function postFiles(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  return axios.post('/api/v1/image/upload', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
