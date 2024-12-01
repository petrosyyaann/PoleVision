import { useEffect, useState } from 'react'
import { ContainerApp, Flex, HistoryTable, Text, Button } from 'shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { deletePhoto, getHistory } from 'entities/file/api'
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Center,
} from '@chakra-ui/react'
import { getStatusInfo, Status } from 'shared/lib/getStatusInfo'
import { useNavigate } from 'react-router-dom'
export interface DataRow {
  id: number
  time: string
  name: string
  status: string
  object_classes: string[]
  preview_s3_url: string
}

const HomePage = () => {
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [update, setUpdate] = useState<boolean>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistory()
        const transformedData = response.data.map(
          (item: {
            id: number
            name: string
            object_classes: string[]
            preview_s3_url_s3_url: string | null
            status: string
            created_at: string
          }) => ({
            id: item.id,
            time: new Date(item.created_at).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            name: item.name,
            status: item.status,
            object_classes: item.object_classes,
            preview_s3_url: Boolean(item.preview_s3_url_s3_url),
          })
        )
        setData(transformedData)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [update])

  const deleteFile = async (name: string) => {
    try {
      const item = data.find((base) => base.name === name)
      if (!item) {
        console.error('Элемент не найден')
        return
      }
      const response = await deletePhoto(item.id)
      console.log(response)
      setUpdate((prev) => !prev)
    } catch (error) {
      console.error('Ошибка при удалении:', error)
    }
  }

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

  // Получаем уникальные классы и распределяем данные
  const uniqueClasses = new Set<string>()
  const singleClassData: Record<string, DataRow[]> = {}
  const multiClassData: DataRow[] = []

  data.forEach((row) => {
    const { object_classes } = row

    if (object_classes.length === 1) {
      const className = object_classes[0]
      uniqueClasses.add(className)

      if (!singleClassData[className]) {
        singleClassData[className] = []
      }
      singleClassData[className].push(row)
    } else if (object_classes.length > 1) {
      multiClassData.push(row)
    }
  })
  const columns: ColumnDef<DataRow>[] = [
    {
      accessorKey: 'time',
      header: 'Время',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Название',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'status',
      header: 'Процесс обработки',
      cell: (info) => (
        <Flex
          justifyContent="center"
          fontWeight={600}
          bg={getStatusInfo(info.getValue() as Status).bgColor}
          color="#373645"
          border={`1px solid ${getStatusInfo(info.getValue() as Status).borderColor}`}
          px={2}
          py={1}
          w="-webkit-fit-content"
          borderRadius="20px"
          textAlign="center"
        >
          {getStatusInfo(info.getValue() as Status).title}
        </Flex>
      ),
    },
    {
      accessorKey: 'object_classes',
      header: 'Классы',
      cell: (info) => {
        const value = info.getValue()
        if (Array.isArray(value)) {
          return value.join(', ') || '—'
        }
        return value || '—'
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: (info) => (
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            fontSize="16px"
            color="#F179C1"
            variant="transparent"
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              setUpdate((prev) => !prev)
              deleteFile(info.row.original.name)
            }}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <ContainerApp>
      <Flex
        h="90svh"
        w="100%"
        direction="column"
        overflowY="scroll"
        overflowX="hidden"
      >
        <Text fontSize="18px" fontWeight={700} mb="15px">
          Изображения
        </Text>
        <Tabs variant="enclosed">
          <TabList
            display="flex"
            flexDirection={['column', 'row']}
            flexWrap={['nowrap', 'wrap']}
            gap={2}
          >
            <Tab fontSize={['sm', 'md', 'lg']}>Все</Tab>
            {Array.from(uniqueClasses).map((className) => (
              <Tab fontSize={['sm', 'md', 'lg']} key={className}>
                {className}
              </Tab>
            ))}
            <Tab fontSize={['sm', 'md', 'lg']}>Несколько классов</Tab>
          </TabList>

          <TabPanels>
            {/* Вкладка "Все классы" */}
            <TabPanel>
              {loading ? (
                <Text>Загрузка данных...</Text>
              ) : (
                <HistoryTable<DataRow> data={data} columns={columns} />
              )}
            </TabPanel>

            {/* Вкладки для каждого уникального класса */}
            {Array.from(uniqueClasses).map((className) => (
              <TabPanel key={className}>
                {loading ? (
                  <Text>Загрузка данных...</Text>
                ) : (
                  <HistoryTable<DataRow>
                    data={singleClassData[className] || []}
                    columns={columns}
                  />
                )}
              </TabPanel>
            ))}

            {/* Вкладка "Несколько классов" */}
            <TabPanel>
              {loading ? (
                <Text>Загрузка данных...</Text>
              ) : (
                <HistoryTable<DataRow>
                  data={multiClassData}
                  columns={columns}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </ContainerApp>
  )
}

export default HomePage
