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
  '0-1': 'Башенного типа',
  '2-3': 'Рюмка вид',
  '6-7': 'Портальная на оттяжках вид',
  '8-9': 'Башенного типа вид',
  '10': 'Другое',
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
    if (object_class === 0 || object_class === 1) classKey = '0-1'
    else if (object_class === 2 || object_class === 3) classKey = '2-3'
    else if (object_class === 6 || object_class === 7) classKey = '6-7'
    else if (object_class === 8 || object_class === 9) classKey = '8-9'
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
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Все классы</Tab>
          {Object.entries(CLASS_NAMES).map(([key, value]) => (
            <Tab key={key}>{value}</Tab>
          ))}
          <Tab>Разные классы</Tab>
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
                .filter((label) => label.object_class === 10)
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
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                {groupedAnnotations[key]?.map((annotation, index) => (
                  <AnnotatedImage
                    key={index}
                    imageUrl={original_s3_url}
                    annotations={[annotation]}
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
