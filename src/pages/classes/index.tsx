import { useEffect, useState } from 'react'
import { ContainerApp, Flex, HistoryTable, Text, Button } from 'shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { deleteClass, getClasses } from 'entities/file/api'
import { Box, Center } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export interface DataRowClass {
  id: number
  name: string
}
const ClassPage = () => {
  const [data, setData] = useState<DataRowClass[]>([])
  const [loading, setLoading] = useState(true)
  const [update, setUpdate] = useState<boolean>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClasses()
        const transformedData = response.data.map(
          (item: { id: number; name: string }) => ({
            id: item.id,
            name: item.name,
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
      const response = await deleteClass(item.id)
      console.log(response)
      setUpdate((prev) => !prev)
    } catch (error) {
      console.error('Ошибка при удалении:', error)
    }
  }

  if (data.length < 1)
    return (
      <ContainerApp>
        <Center h="100%">
          <Text fontSize="24px" fontWeight={700} mb="15px">
            Пусто :(
          </Text>
        </Center>
      </ContainerApp>
    )

  const columns: ColumnDef<DataRowClass>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: (info) => info.getValue(),
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
      <Flex w="100%" justifyContent="flex-end">
        <Button onClick={() => navigate('/upload/class')}>
          Добавить класс
        </Button>
      </Flex>
      <Flex
        h="90svh"
        w="100%"
        direction="column"
        overflowY="scroll"
        overflowX="hidden"
      >
        <Text fontSize="18px" fontWeight={700} mb="15px">
          Классы
        </Text>

        {loading ? (
          <Text>Загрузка данных...</Text>
        ) : (
          <HistoryTable<DataRowClass>
            click={false}
            data={data}
            columns={columns}
          />
        )}
      </Flex>
    </ContainerApp>
  )
}

export default ClassPage
