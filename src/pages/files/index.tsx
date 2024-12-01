import { useState, useEffect } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Box,
  Text,
} from '@chakra-ui/react'
import { ContainerApp } from 'shared/ui'
import { DataRow } from 'pages/home'
import { getHistory } from 'entities/file/api'
import { PreviewCard } from 'widgets/PreviewCard'
import { useNavigate } from 'react-router-dom'

const Files = () => {
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await getHistory()
        setData(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <ContainerApp>Загрузка...</ContainerApp>

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
      <Text fontSize="18px" fontWeight={700} mb="15px">
        Превью изображений
      </Text>
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
            <Box maxH="80svh" overflowY="auto">
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
            </Box>
          </TabPanel>

          {/* Вкладки для уникальных классов */}
          {uniqueClasses.map((className) => (
            <TabPanel key={className}>
              <Box maxH="80svh" overflowY="auto">
                <SimpleGrid
                  overflowY="scroll"
                  columns={[1, 2, 3, 4, 5]}
                  spacing={4}
                >
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
              </Box>
            </TabPanel>
          ))}

          {/* Вкладка "Несколько классов" */}
          <TabPanel>
            <Box maxH="80svh" overflowY="auto">
              <SimpleGrid
                overflowY="scroll"
                columns={[1, 2, 3, 4, 5]}
                spacing={4}
              >
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
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContainerApp>
  )
}

export default Files
