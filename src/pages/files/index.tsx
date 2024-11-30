import { useState, useEffect } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { ContainerApp } from 'shared/ui'
import AnnotatedImage, {
  Annotation,
} from 'widgets/AnnotatedImage/AnnotatedImage'
import { getPhoto } from 'entities/file/api'

export interface FileData {
  id: number
  name: string
  original_s3_url: string
  status: 'completed' | 'pending' | 'failed'
  labeling: Annotation[]
  created_at: string
}

const CLASS_NAMES: Record<string, string> = {
  '0-8': 'Одноцепная башенного типа',
  '1-7': 'Двухцепная башенного типа',
  '2-9': 'Свободно стоящая типа «рюмка»',
  '5-6': 'Портальная на оттяжках',
  '10': 'Другие классы',
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

  // Группировка аннотаций по объединенным классам
  const groupedAnnotations: Record<string, Annotation[]> = {}
  labeling.forEach((label) => {
    const { object_class, ...rest } = label

    // Создаем ключ для объединенных классов
    let classKey = object_class.toString()
    if (object_class === 0 || object_class === 8) classKey = '0-8'
    else if (object_class === 1 || object_class === 7) classKey = '1-7'
    else if (object_class === 2 || object_class === 9) classKey = '2-9'
    else if (object_class === 5 || object_class === 6) classKey = '5-6'
    else if (object_class === 10) classKey = '10'

    if (!groupedAnnotations[classKey]) {
      groupedAnnotations[classKey] = []
    }
    groupedAnnotations[classKey].push({
      object_class: object_class,
      ...rest,
    })
  })

  return (
    <ContainerApp>
      <Tabs variant="enclosed" isFitted>
        <TabList
          display="flex"
          flexDirection={['column', 'row']}
          flexWrap={['nowrap', 'wrap']}
          gap={2}
        >
          <Tab fontSize={['sm', 'md', 'lg']}>Все классы</Tab>
          {Object.entries(CLASS_NAMES).map(([key, value]) => (
            <Tab fontSize={['sm', 'md', 'lg']} key={key}>
              {value}
            </Tab>
          ))}
          <Tab fontSize={['sm', 'md', 'lg']}>Несколько классов</Tab>
        </TabList>

        <TabPanels>
          {/* Вкладка "Все классы" */}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              <AnnotatedImage
                imageUrl={original_s3_url}
                annotations={labeling.map((label) => ({
                  ...label,
                }))}
              />
            </SimpleGrid>
          </TabPanel>

          {/* Вкладка "Разные" */}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {labeling
                .filter(
                  (label) =>
                    !['0-1', '2-3', '6-7', '8-9', '10'].includes(
                      label.object_class.toString()
                    )
                )
                .map((annotation, index) => (
                  <AnnotatedImage
                    key={index}
                    imageUrl={original_s3_url}
                    annotations={[annotation]}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>

          {/* Вкладки по объединенным классам */}
          {Object.entries(CLASS_NAMES).map(([key]) => (
            <TabPanel key={key}>
              <SimpleGrid columns={[1, 2, 3]} spacing={[2, 4, 6]} p={[2, 4, 6]}>
                {labeling.map((label, index) => (
                  <AnnotatedImage
                    key={index}
                    imageUrl={original_s3_url}
                    annotations={[label]}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </ContainerApp>
  )
}

export default Files
