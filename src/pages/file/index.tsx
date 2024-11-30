import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerApp, Flex } from 'shared/ui'
import AnnotatedImage, {
  Annotation,
} from 'widgets/AnnotatedImage/AnnotatedImage'
import { getPhoto } from 'entities/file/api'
import { Status } from 'shared/lib/getStatusInfo'

export interface FileData {
  id: number
  name: string
  original_s3_url: string
  status: Status
  labeling: Annotation[]
  created_at: string
}

const Files = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<FileData>({} as FileData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await getPhoto(Number(id))
        console.log(response.data)
        setData({
          id: 1,
          name: '',
          status: 'completed',
          created_at: '',
          original_s3_url: 'nnnf',
          labeling: [
            {
              object_class: 'Какая-то крутая башня',
              x_center: 0.3985,
              y_center: 0.779875,
              width: 0.137,
              height: 0.13925,
              prob: 0.444,
            },
            {
              object_class: 'Какая-то крутая башня',
              x_center: 0.13916666666666666,
              y_center: 0.66725,
              width: 0.15266666666666667,
              height: 0.15,
              prob: 0.434,
            },
          ],
        })
      } catch (err) {
        console.log(err)
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) return <ContainerApp>Загрузка...</ContainerApp>
  if (error) return <ContainerApp>{error}</ContainerApp>
  const { labeling, original_s3_url } = data

  return (
    <ContainerApp>
      <Flex maxH='90svh'>
        <AnnotatedImage
          imageUrl={original_s3_url}
          annotations={labeling.map((label) => ({
            ...label,
          }))}
        />
      </Flex>
    </ContainerApp>
  )
}

export default Files
