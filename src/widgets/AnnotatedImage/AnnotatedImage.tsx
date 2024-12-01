import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'shared/iconpack'

export interface Annotation {
  object_class: string
  x_center: number
  y_center: number
  width: number
  height: number
  prob: number
}

interface AnnotatedImageProps {
  imageUrl: string
  annotations: Annotation[]
}

const getColorByClass = (objectClass: string): string => {
  if ('Одноцепная башенного типа' === objectClass) return '#7984F1'
  if ('Двухцепная башенного типа' === objectClass) return '#61C6FF'
  if ('Свободно стоящая типа «рюмка»' === objectClass) return '#F179C1'
  if ('Портальная на оттяжках' === objectClass) return '#79F17E'
  if (objectClass === 'Другие классы') return '#FFDC61'
  return '#000000'
}

const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  imageUrl,
  annotations,
}) => {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<Annotation | null>(
    null
  )
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (canvas && context) {
      const image = new Image()
      image.src = `http://93.182.50.84:28088..${imageUrl}`

      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height

        const drawCanvas = () => {
          context.clearRect(0, 0, canvas.width, canvas.height)

          context.save()
          context.scale(scale, scale)
          context.translate(translate.x, translate.y)

          context.drawImage(image, 0, 0)

          annotations.forEach(
            ({ x_center, y_center, width, height, object_class }) => {
              const x = (x_center - width / 2) * image.width
              const y = (y_center - height / 2) * image.height
              const boxWidth = width * image.width
              const boxHeight = height * image.height

              context.strokeStyle = getColorByClass(object_class)
              context.lineWidth = 20 / scale
              context.strokeRect(x, y, boxWidth, boxHeight)
            }
          )

          context.restore()
        }

        drawCanvas()
      }
    }
  }, [imageUrl, annotations, scale, translate])

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setLastMousePosition(null)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if (isDragging && lastMousePosition) {
      // Вычисляем смещение на основе движения мыши
      const dx = (event.clientX - lastMousePosition.x) / scale
      const dy = (event.clientY - lastMousePosition.y) / scale

      // Обновляем смещение (translate)
      setTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }))

      // Обновляем последнюю позицию мыши
      setLastMousePosition({ x: event.clientX, y: event.clientY })
    } else {
      // Обработка hover-аннотаций
      const mouseX = (event.clientX - rect.left) * scaleX
      const mouseY = (event.clientY - rect.top) * scaleY

      // Корректируем координаты мыши с учетом зума и смещения
      const adjustedMouseX = mouseX / scale - translate.x
      const adjustedMouseY = mouseY / scale - translate.y

      let foundAnnotation: Annotation | null = null

      annotations.forEach((annotation) => {
        const { x_center, y_center, width, height } = annotation

        // Координаты аннотаций в пикселях
        const x = (x_center - width / 2) * canvas.width
        const y = (y_center - height / 2) * canvas.height
        const boxWidth = width * canvas.width
        const boxHeight = height * canvas.height

        // Проверяем попадание курсора
        if (
          adjustedMouseX >= x &&
          adjustedMouseX <= x + boxWidth &&
          adjustedMouseY >= y &&
          adjustedMouseY <= y + boxHeight
        ) {
          foundAnnotation = annotation
          setTooltipPosition({
            x: event.clientX, // Для отображения тултипа
            y: event.clientY,
          })
        }
      })

      setHoveredAnnotation(foundAnnotation)
      if (!foundAnnotation) {
        setTooltipPosition(null)
      }
    }
  }

  const handleMouseLeave = () => {
    setHoveredAnnotation(null)
    setTooltipPosition(null)
  }

  const zoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale + 0.1, 3)
      adjustTranslate(newScale, prevScale)
      return newScale
    })
  }

  const zoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale - 0.1, 0.5)
      adjustTranslate(newScale, prevScale)
      return newScale
    })
  }

  const adjustTranslate = (newScale: number, prevScale: number) => {
    setTranslate((prevTranslate) => {
      const canvas = canvasRef.current
      if (!canvas) return prevTranslate

      const rect = canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const deltaScale = newScale / prevScale
      return {
        x: (prevTranslate.x - centerX) * deltaScale + centerX,
        y: (prevTranslate.y - centerY) * deltaScale + centerY,
      }
    })
  }

  return (
    <Flex position="relative" maxH="90svh" w="100%" justifyContent="center">
      <Flex
        position="absolute"
        top="45%"
        left="10px"
        flexDirection="column"
        gap="10px"
        zIndex="10"
      >
        <IconButton
          icon={<Plus />}
          background="#83D2FF"
          onClick={zoomIn}
          aria-label={'plus'}
        />
        <IconButton
          icon={<Minus />}
          background="#83D2FF"
          onClick={zoomOut}
          aria-label={'minus'}
        />
      </Flex>
      <canvas
        ref={canvasRef}
        style={{ maxWidth: '100%', height: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredAnnotation && tooltipPosition && (
        <Tooltip
          label={hoveredAnnotation.object_class}
          isOpen
          placement="top"
          bg="blackAlpha.700"
          color="white"
          borderRadius="md"
          fontSize="md"
          px="4"
          py="2"
          hasArrow
        >
          <Box
            position="fixed"
            left={`${tooltipPosition.x}px`}
            top={`${tooltipPosition.y - 10}px`}
            transform="translate(-50%, -100%)"
            zIndex="999"
          />
        </Tooltip>
      )}
    </Flex>
  )
}

export default AnnotatedImage
