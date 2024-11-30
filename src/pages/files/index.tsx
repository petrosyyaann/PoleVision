import { useState, useEffect } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from '@chakra-ui/react'
import { ContainerApp } from 'shared/ui'
import { DataRow } from 'pages/home'
import { getHistory } from 'entities/file/api'
import { PreviewCard } from 'widgets/PreviewCard'
import { useNavigate } from 'react-router-dom'

const Files = () => {
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await getHistory()
        setData(response.data)
      } catch (err) {
        console.log(err)
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <ContainerApp>Загрузка...</ContainerApp>
  if (error) return <ContainerApp>{error}</ContainerApp>

  // Получаем уникальные классы
  const uniqueClasses = Array.from(
    new Set(
      data.flatMap((row) =>
        row.object_classes.length === 1 ? row.object_classes : []
      )
    )
  )

  return (
    <ContainerApp>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Все</Tab>
          {uniqueClasses.map((className) => (
            <Tab key={className}>{className}</Tab>
          ))}
          <Tab>Несколько классов</Tab>
        </TabList>

        <TabPanels>
          {/* Вкладка "Все" */}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4}>
              {data.map((row, index) => (
                <PreviewCard
                  key={index}
                  imageUrl={row.preview_s3_url}
                  status={row.status}
                  title={row.name}
                  onClick={() => navigate(`/file/${row.id}`)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Вкладки для уникальных классов */}
          {uniqueClasses.map((className) => (
            <TabPanel key={className}>
              <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4}>
                {data
                  .filter(
                    (row) =>
                      row.object_classes.length === 1 &&
                      row.object_classes[0] === className
                  )
                  .map((row, index) => (
                    <PreviewCard
                      key={index}
                      imageUrl={row.preview_s3_url}
                      status={row.status}
                      title={row.name}
                      onClick={() => navigate('/file/:id')}
                    />
                  ))}
              </SimpleGrid>
            </TabPanel>
          ))}

          {/* Вкладка "Несколько классов" */}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4}>
              {data
                .filter((row) => row.object_classes.length > 1)
                .map((row, index) => (
                  <PreviewCard
                    key={index}
                    imageUrl={row.preview_s3_url}
                    status={row.status}
                    title={row.name}
                    onClick={() => navigate('/file/:id')}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContainerApp>
  )
}

export default Files
