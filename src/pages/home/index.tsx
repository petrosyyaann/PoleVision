import { useEffect, useState } from 'react'
import { ContainerApp, Flex, HistoryTable, Text } from 'shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { getHistory } from 'entities/file/api'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { getStatusInfo, Status } from 'shared/lib/getStatusInfo'
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
  }, [])

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
                <HistoryTable data={data} columns={columns} />
              )}
            </TabPanel>

            {/* Вкладки для каждого уникального класса */}
            {Array.from(uniqueClasses).map((className) => (
              <TabPanel key={className}>
                {loading ? (
                  <Text>Загрузка данных...</Text>
                ) : (
                  <HistoryTable
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
                <HistoryTable data={multiClassData} columns={columns} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </ContainerApp>
  )
}

export default HomePage
