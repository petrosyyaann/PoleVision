import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerApp, Flex } from 'shared/ui'
import AnnotatedImage, {
  Annotation,
} from 'widgets/AnnotatedImage/AnnotatedImage'
import { getPhoto } from 'entities/file/api'
import { Status } from 'shared/lib/getStatusInfo'
import { Spinner } from '@chakra-ui/react'

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
        setData(response.data)
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
      <Flex
        maxH="90svh"
        w="100%"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <AnnotatedImage
          imageUrl={original_s3_url}
          annotations={labeling.map((label) => ({
            ...label,
          }))}
        />
        <Spinner position="absolute" />
      </Flex>
    </ContainerApp>
  )
}

export default Files
