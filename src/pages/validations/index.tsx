import { useEffect, useState } from 'react'
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Spinner,
  Center,
  Code,
  VStack,
  Box,
} from '@chakra-ui/react'
import { Button, ContainerApp, Flex, HistoryTable } from 'shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { getValidates } from 'entities/file/api'
import { useNavigate } from 'react-router-dom'

export interface ValidationStatistics {
  map_base: number
  map_50: number
  map_75: number
  map_msall: number
  mar_1: number
  mar_10: number
  mar_100: number
  mar_small: number
  multiclass_accuracy: number
  multiclass_f1_score: number
  multiclass_precision: number
  multiclass_recall: number
}

export interface GetValidationData {
  id: number
  name: string
  created_at: string // Лучше Date, но зависит от API
  is_finished: boolean
  metrics: ValidationStatistics
}

const ValidatePage = () => {
  const [validations, setValidations] = useState<GetValidationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getValidates()
        setValidations(response.data)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigate = useNavigate()

  if (validations.length < 1)
    return (
      <ContainerApp>
        <Center h="100%" flexDirection="column">
          <Text fontSize="24px" fontWeight={700} mb="15px">
            Пусто :(
          </Text>
          <Button onClick={() => navigate('/upload')}>
            Загрузить изображения с txt
          </Button>
          <VStack align="start" spacing="4" w="70%" p={6} textAlign="center">
            <Text>
              Для создания валидаций необходим<Code>*.txt</Code> файл на каждое
              изображение.
              <br />
              Формат файла <Code>*.txt</Code>: одна строка на объект в формате{' '}
              <Code>"class" x_center y_center width height</Code>.
            </Text>
            <Text>
              Координаты боксов должны быть в нормализованном формате{' '}
              <Code>xywh</Code>
              (от 0 до 1). Если ваши координаты в пикселях, разделите{' '}
              <Code>x_center</Code>и <Code>width</Code> на ширину изображения, а{' '}
              <Code>y_center</Code> и<Code>height</Code> — на высоту
              изображения.
            </Text>
            <Box>
              <Text mb="2" fontWeight="bold">
                Пример:
              </Text>
              <Code p="2" borderRadius="md" bg="gray.200">
                "Эйфелева башня" 0.1903 0.3348 0.0882 0.3869
                <br />
                "Деревянный столб" 0.5357 0.2946 0.1362 0.4048
              </Code>
            </Box>
          </VStack>
        </Center>
      </ContainerApp>
    )

  const finished = validations.filter((v) => v.is_finished)
  const inProgress = validations.filter((v) => !v.is_finished)

  const finishedColumns: ColumnDef<GetValidationData>[] = [
    { accessorKey: 'name', header: 'Название' },
    {
      accessorKey: 'created_at',
      header: 'Время',
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
    { accessorKey: 'metrics.map_base', header: 'mAP Base' },
    { accessorKey: 'metrics.map_50', header: 'mAP 50' },
    { accessorKey: 'metrics.map_75', header: 'mAP 75' },
    { accessorKey: 'metrics.map_msall', header: 'mAP MSAll' },
    { accessorKey: 'metrics.mar_1', header: 'mAR 1' },
    { accessorKey: 'metrics.mar_10', header: 'mAR 10' },
    { accessorKey: 'metrics.mar_100', header: 'mAR 100' },
    { accessorKey: 'metrics.mar_small', header: 'mAR Small' },
    { accessorKey: 'metrics.multiclass_accuracy', header: 'Accuracy' },
    { accessorKey: 'metrics.multiclass_f1_score', header: 'F1-Score' },
    { accessorKey: 'metrics.multiclass_precision', header: 'Precision' },
    { accessorKey: 'metrics.multiclass_recall', header: 'Recall' },
  ]

  const inProgressColumns: ColumnDef<GetValidationData>[] = [
    { accessorKey: 'name', header: 'Название' },
    {
      accessorKey: 'created_at',
      header: 'Время',
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
  ]

  return (
    <ContainerApp>
      <Flex w="100%" alignItems="center">
        <Text fontSize="18px" fontWeight={700}>
          Валидации
        </Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Tabs isFitted variant="enclosed" mt={4}>
          <TabList>
            <Tab>Завершенные</Tab>
            <Tab>В процессе</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <HistoryTable<GetValidationData>
                data={finished}
                columns={finishedColumns}
                click={false}
                enableSorting
              />
            </TabPanel>
            <TabPanel>
              <HistoryTable<GetValidationData>
                data={inProgress}
                columns={inProgressColumns}
                click={false}
                enableSorting
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </ContainerApp>
  )
}

export default ValidatePage
