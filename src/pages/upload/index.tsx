import { useRef, useState } from 'react'
import {
  Flex,
  Icon,
  IconButton,
  Input,
  Text,
  useToast,
  useBreakpointValue,
  Progress,
} from '@chakra-ui/react'
import { Close, Upload, Camera } from 'shared/iconpack'
import { Button, ContainerApp } from 'shared/ui'
import { postFiles, postClass } from 'entities/file/api'
import { useNavigate, useParams } from 'react-router-dom'
import { Instruction } from 'widgets/Instruction/Instruction'
import InfoWithDetails from 'widgets/ValidateInstruction'

async function callFunction(name: boolean) {
  return name ? postClass : postFiles
}

const UploadPage = () => {
  const navigate = useNavigate()
  const { name } = useParams()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : []
    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) inputRef.current.click()
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: 'Ошибка!',
        description: 'Пожалуйста, выберите файлы перед загрузкой.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setIsLoading(true)
    try {
      const chosenFunction = await callFunction(!!name)
      await chosenFunction(files, (progressEvent) => {
        const { loaded, total } = progressEvent
        if (total) {
          setProgress(Math.round((loaded / total) * 100))
        }
      })
      toast({
        title: 'Успешно!',
        description: 'Файлы загружены.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/')
    } catch {
      toast({
        title: 'Ошибка при загрузке!',
        description: 'Не удалось загрузить файлы. Попробуйте снова.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  return (
    <ContainerApp>
      <Flex direction="column" w="100%" h="100%">
        <Text fontSize="18px" fontWeight="700" mb="15px">
          {name ? 'Добавление классов' : 'Загрузка изображений для детекции'}
        </Text>
        {name ? <Instruction /> : <InfoWithDetails />}
        <Flex
          h="100%"
          direction="column"
          align="center"
          justify="center"
          borderWidth="2px"
          borderColor="blue.500"
          borderStyle="dashed"
          borderRadius="md"
          p="6"
          w="100%"
          textAlign="center"
          position="relative"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.dropEffect = 'copy'
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const newFiles = Array.from(e.dataTransfer.files)
            if (newFiles.length > 0) {
              setFiles((prevFiles) => [...prevFiles, ...newFiles])
            }
          }}
        >
          <Icon as={Upload} boxSize={12} color="blue.500" />
          <Text fontSize="18px" mt="4">
            Перетащите файл сюда <br /> <b>{`PNG, JPG, JPEG, ZIP, RAR, TXT`}</b>
          </Text>
          <Text fontSize="18px" mt="4">
            или
          </Text>
          <Input
            type="file"
            accept={`.png, .jpg, .jpeg, .zip, .rar, .txt'`}
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e)}
          />
          <Button
            mt={4}
            bg="red.500"
            color="white"
            onClick={() => triggerFileInput(fileInputRef)}
          >
            Выберите файлы
          </Button>
        </Flex>

        {isMobile && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="100%"
            mt="6"
          >
            <Button
              bg="red.500"
              color="white"
              leftIcon={<Camera fill="white" />}
              onClick={() => triggerFileInput(cameraInputRef)}
            >
              Открыть камеру
            </Button>
            <Input
              type="file"
              accept="image/*"
              capture
              ref={cameraInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e)}
            />
          </Flex>
        )}

        {files.length > 0 && (
          <Flex
            direction="column"
            align={isMobile ? 'center' : ''}
            w="100%"
            mt="6"
          >
            <Text>Выбранные файлы:</Text>
            {files.map((file, index) => (
              <Flex key={index} gap="15px" align="center">
                <Text fontSize="sm" noOfLines={1}>
                  {file.name}
                </Text>
                <IconButton
                  colorScheme="transparent"
                  icon={<Close />}
                  aria-label="Удалить файл"
                  onClick={() => removeFile(index)}
                />
              </Flex>
            ))}
            {isLoading ? (
              <Progress borderRadius="15px" value={progress} size="sm" mt="4" />
            ) : (
              <Button mt="4" color="white" onClick={handleSubmit}>
                Загрузить
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </ContainerApp>
  )
}

export default UploadPage
