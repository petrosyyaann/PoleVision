import { useRef, useState } from 'react'
import {
  Flex,
  Icon,
  IconButton,
  Input,
  Text,
  useToast,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Close, Upload, Camera } from 'shared/iconpack'
import { Button, ContainerApp } from 'shared/ui'
import { postFiles } from 'entities/file/api'

const UploadPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    source: string
  ) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : []
    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      toast({
        title: `${source === 'camera' ? 'Фотография' : 'Файлы'} добавлены.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
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
      const response = await postFiles(files)
      if (response.status === 201) {
        setFiles([])
        toast({
          title: 'Успешно!',
          description: 'Файлы загружены.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
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
    }
  }

  return (
    <ContainerApp>
      <Flex direction="column" align="center" w="100%" h="100%">
        <Text fontSize="18px" fontWeight="700" mb="15px">
          Загрузка данных
        </Text>
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
        >
          <Icon as={Upload} boxSize={12} color="blue.500" />
          <Text fontSize="18px" mt="4">
            Перетащите файл сюда <br /> <b>PNG, JPG, JPEG, ZIP, RAR</b>
          </Text>
          <Text fontSize="18px" mt="4">
            или
          </Text>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg, .zip, .rar"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e, 'file')}
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
              onChange={(e) => handleFileSelect(e, 'camera')}
            />
          </Flex>
        )}

        {files.length > 0 && (
          <Flex direction="column" align="center" w="100%" mt="6">
            <Text>Выбранные файлы:</Text>
            {files.map((file, index) => (
              <Flex key={index} justify="space-between" align="center" w="100%">
                <Text fontSize="sm" noOfLines={1}>
                  {file.name}
                </Text>
                <IconButton
                  icon={<Close />}
                  aria-label="Удалить файл"
                  onClick={() => removeFile(index)}
                />
              </Flex>
            ))}
            <Button
              mt="4"
              bg="blue.500"
              color="white"
              onClick={handleSubmit}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : 'Загрузить'}
            </Button>
          </Flex>
        )}
      </Flex>
    </ContainerApp>
  )
}

export default UploadPage
