import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

export interface Annotation {
  object_class: number // Класс объекта
  x_center: number // Центр области по X (относительная координата, 0-1)
  y_center: number // Центр области по Y (относительная координата, 0-1)
  width: number // Ширина области (относительная к изображению, 0-1)
  height: number // Высота области (относительная к изображению, 0-1)
  prob: number // Вероятность (доверие модели, 0-1)
}

interface AnnotatedImageProps {
  imageUrl: string
  annotations: Annotation[]
}

const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  imageUrl,
  annotations,
}) => {
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
      image.src = imageUrl

      image.onload = () => {
        // Устанавливаем размеры canvas равными размеру изображения
        canvas.width = image.width
        canvas.height = image.height

        // Рисуем изображение
        context.drawImage(image, 0, 0)

        // Рисуем все аннотации
        annotations.forEach(({ x_center, y_center, width, height }) => {
          // Преобразуем относительные координаты в абсолютные
          const x = (x_center - width / 2) * image.width
          const y = (y_center - height / 2) * image.height
          const boxWidth = width * image.width
          const boxHeight = height * image.height

          // Рисуем рамку
          context.strokeStyle = 'red'
          context.lineWidth = 20
          context.strokeRect(x, y, boxWidth, boxHeight)
        })
      }
    }
  }, [imageUrl, annotations])

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = (event.clientX - rect.left) * scaleX
    const mouseY = (event.clientY - rect.top) * scaleY

    let foundAnnotation: Annotation | null = null

    annotations.forEach((annotation) => {
      const { x_center, y_center, width, height } = annotation
      const x = (x_center - width / 2) * canvas.width
      const y = (y_center - height / 2) * canvas.height
      const boxWidth = width * canvas.width
      const boxHeight = height * canvas.height

      // Проверяем, находится ли курсор внутри аннотации
      if (
        mouseX >= x &&
        mouseX <= x + boxWidth &&
        mouseY >= y &&
        mouseY <= y + boxHeight
      ) {
        foundAnnotation = annotation
        setTooltipPosition({ x: mouseX, y: mouseY })
      }
    })

    setHoveredAnnotation(foundAnnotation)
    if (!foundAnnotation) setTooltipPosition(null)
  }

  const handleMouseLeave = () => {
    setHoveredAnnotation(null)
    setTooltipPosition(null)
  }

  return (
    <Flex position="relative" width="100%" height="auto">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredAnnotation && tooltipPosition && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            pointerEvents: 'none',
            fontSize: '14px',
            zIndex: 9999,
          }}
        >
          <Text color="white">Class: {hoveredAnnotation.object_class}</Text>
        </div>
      )}
    </Flex>
  )
}

export default AnnotatedImage
