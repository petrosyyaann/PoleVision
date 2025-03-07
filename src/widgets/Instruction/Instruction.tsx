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

export const Instruction = () => {
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
          Следуйте указанным инструкциям для корректного форматирования данных.
        </Text>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box bg="#f9faff" borderRadius="md" p={4} mt={2}>
          <VStack align="start" spacing={3}>
            <Text>
              Метки для этого формата должны быть экспортированы с одним{' '}
              <Code>*.txt</Code> файлом на изображение. Если на изображении нет
              объектов, файл <Code>*.txt</Code> не требуется.
            </Text>
            <Text>
              Формат файла <Code>*.txt</Code>: одна строка на объект в формате{' '}
              <Code>"class" x_center y_center width height</Code>.
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
                "Эйфелева башня" 0.5124 0.4023 0.1532 0.2746
                <br />
                "Деревянный столб" 0.7235 0.2843 0.0921 0.1983
              </Code>
            </Box>
          </VStack>
        </Box>
      </Collapse>
    </VStack>
  )
}
