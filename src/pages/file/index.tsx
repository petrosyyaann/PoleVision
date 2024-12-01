import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ContainerApp, Flex, Text } from 'shared/ui'
import AnnotatedImage, {
  Annotation,
} from 'widgets/AnnotatedImage/AnnotatedImage'
import { getPhoto } from 'entities/file/api'
import { Status } from 'shared/lib/getStatusInfo'
import { Center, Spinner } from '@chakra-ui/react'

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
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await getPhoto(Number(id))
        setData(
          response.data.map(
            (i: {
              label: string
              x: number
              y: number
              w: number
              h: number
            }) => ({
              object_class: i.label,
              x_center: i.x,
              y_center: i.y,
              width: i.w,
              height: i.h,
            })
          )
        )
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading)
    return (
      <ContainerApp>
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Spinner size="lg" />
        </Flex>
      </ContainerApp>
    )
  if (!data)
    return (
      <ContainerApp>
        <Center h="100%" flexDirection="column">
          <>
            <Text fontSize="18px" fontWeight={700} mb="15px">
              Пусто :(
            </Text>
            <Button onClick={() => navigate('/upload')}>
              Загрузить изображения
            </Button>
          </>
        </Center>
      </ContainerApp>
    )
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
