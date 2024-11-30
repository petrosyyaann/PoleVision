import { useEffect, useState } from 'react'
import { ContainerApp, Flex, HistoryTable, Text } from 'shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { getHistory } from 'entities/file/api'

const HomePage = () => {
  interface DataRow {
    id: number
    time: string
    fileName: string
    status: string
    classes: string
    preview: boolean
  }

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
            preview_s3_url: string | null
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
            fileName: item.name,
            status: item.status === 'completed' ? 'Обработано' : 'В процессе',
            classes:
              item.object_classes.length > 0
                ? item.object_classes.join(', ')
                : '—',
            preview: Boolean(item.preview_s3_url),
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

  const stateColors: Record<string, string> = {
    Обработано: '#F4FCE3',
    'В процессе': '#FFF9DB',
  }
  const borderStateColors: Record<string, string> = {
    Обработано: '#A9E34B',
    'В процессе': '#FFD43B',
  }

  const columns: ColumnDef<DataRow>[] = [
    {
      accessorKey: 'time',
      header: 'Время',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'fileName',
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
          bg={stateColors[info.getValue() as string]}
          color="#373645"
          border={`1px solid ${borderStateColors[info.getValue() as string]}`}
          px={2}
          py={1}
          w="-webkit-fit-content"
          borderRadius="20px"
          textAlign="center"
        >
          {info.getValue() as string}
        </Flex>
      ),
    },
    {
      accessorKey: 'classes',
      header: 'Классы',
      cell: (info) => info.getValue(),
    },
  ]

  return (
    <ContainerApp>
      <Flex
        h="90vh"
        w="100%"
        direction="column"
        overflowY="scroll"
        overflowX="hidden"
      >
        <Text fontSize="18px" fontWeight={700} mb="15px">
          История загрузки
        </Text>
        {loading ? (
          <Text>Загрузка данных...</Text>
        ) : (
          <HistoryTable data={data} columns={columns} />
        )}
      </Flex>
    </ContainerApp>
  )
}

export default HomePage
