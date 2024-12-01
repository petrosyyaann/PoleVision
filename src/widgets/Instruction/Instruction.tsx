import { Box, Text, Code, VStack } from '@chakra-ui/react'

export const Instruction = () => {
  return (
    <Box mb="4">
      <Text fontSize="m" mb="4">
        Инструкция для форматирования лейблов
      </Text>
      <VStack align="start" spacing="4">
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
          <Code>xywh</Code>
          (от 0 до 1). Если ваши координаты в пикселях, разделите{' '}
          <Code>x_center</Code>и <Code>width</Code> на ширину изображения, а{' '}
          <Code>y_center</Code> и<Code>height</Code> — на высоту изображения.
        </Text>
        <Box>
          <Text mb="2" fontWeight="bold">
            Пример:
          </Text>
          <Code p="2" borderRadius="md" bg="gray.200">
            "кот" 0.1903 0.3348 0.0882 0.3869
            <br />
            "собака" 0.5357 0.2946 0.1362 0.4048
            <br />
            "птица" 0.4905 0.4263 0.0413 0.1235
          </Code>
        </Box>
      </VStack>
    </Box>
  )
}
