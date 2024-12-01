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
  Center,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { Button, ContainerApp } from 'shared/ui'
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

  if (loading)
    return (
      <ContainerApp>
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Spinner size="lg" />
        </Flex>
      </ContainerApp>
    )
  if (data.length < 1)
    return (
      <ContainerApp>
        <Center h="100%" flexDirection="column">
          <Text fontSize="18px" fontWeight={700} mb="15px">
            Пусто :(
          </Text>
          <Button onClick={() => navigate('/upload')}>
            Загрузить изображения
          </Button>
        </Center>
      </ContainerApp>
    )

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
