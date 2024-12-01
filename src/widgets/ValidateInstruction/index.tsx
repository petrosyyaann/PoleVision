import {
  VStack,
  Text,
  Code,
  Button,
  Box,
  Collapse,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'

const InfoWithDetails = () => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <VStack mb="15px" align="start">
      <Flex alignItems="center" gap="10px">
        <Button
          onClick={onToggle}
          size="sm"
          background="#ebedfd"
          borderRadius="50%"
          color="black"
          _hover={{ background: '#d6d8fa' }}
          p={0}
          w="30px"
          h="30px"
        >
          ?
        </Button>
        <Text fontSize="14px">
          Если Вы хотите провалидировать данные, требуется <Code>*.txt</Code>{' '}
          файл.
        </Text>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box bg="#f9faff" borderRadius="md" p={4} mt={2}>
          <VStack align="start" spacing={3}>
            <Text>
              Формат файла <Code>*.txt</Code>: одна строка на объект в формате{' '}
              <Code>"class" x_center y_center width height</Code>
            </Text>
            <Text>
              Координаты боксов должны быть в нормализованном формате{' '}
              <Code>xywh</Code> (от 0 до 1). Если ваши координаты в пикселях,
              разделите <Code>x_center</Code> и <Code>width</Code> на ширину
              изображения, а <Code>y_center</Code> и <Code>height</Code> — на
              высоту изображения.
            </Text>
            <Box>
              <Text mb="1" fontWeight="bold">
                Пример:
              </Text>
              <Code p="2" borderRadius="md" bg="gray.200" display="block">
                "Эйфелева башня" 0.1903 0.3348 0.0882 0.3869
                <br />
                "Деревянный столб" 0.5357 0.2946 0.1362 0.4048
              </Code>
            </Box>
          </VStack>
        </Box>
      </Collapse>
    </VStack>
  )
}

export default InfoWithDetails
