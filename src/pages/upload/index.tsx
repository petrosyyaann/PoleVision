import React, { useRef, useState } from 'react'
import {
  Flex,
  Icon,
  IconButton,
  Input,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { Close, Upload } from 'shared/iconpack'
import { Button, ContainerApp } from 'shared/ui'
import { postFiles } from 'entities/file/api'

const UploadPage = () => {
  const [file, setFile] = useState<File[] | null>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : []
    setFile(newFiles)
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveFile = (index: number) => {
    setFile((prev) => prev && prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Ошибка!',
        description: 'Пожалуйста, выберите файл перед загрузкой.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await postFiles(file)
      if (response.status === 201) {
        setFile(null)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
      toast({
        title: 'Ошибка при загрузке!',
        description: 'Не удалось загрузить файл. Попробуйте снова.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <ContainerApp>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
      >
        <Flex w="100%">
          <Text fontSize="18px" fontWeight={700} mb="15px">
            Загрузка данных
          </Text>
        </Flex>
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          borderWidth={2}
          borderColor="blue.500"
          borderStyle="dashed"
          borderRadius="md"
          p={6}
          w="100%"
          h="100%"
          textAlign="center"
          position="relative"
        >
          <Icon as={Upload} boxSize={12} color="blue.500" />
          <Text fontSize="18px" mt={4}>
            Перенесите файл в это окно <br /> <b>PNG, JPG, JPEG, ZIP, RAR</b>
          </Text>
          <Text fontSize="18px" mt={4}>
            или
          </Text>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg, .zip, .rar"
            onChange={handleFileChange}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            opacity={0}
            cursor="pointer"
            h="100%"
            ref={fileInputRef}
            multiple
          />
          <Button
            mt={4}
            background="red.500"
            color="white"
            onClick={handleUploadClick}
          >
            Нажмите для загрузки
          </Button>
        </Flex>
        {file && (
          <Flex mt={6} w="100%" direction="row" alignItems="center" gap="10px">
            <Text>Выбранные файлы:</Text>
            {file.map((file, index) => (
              <Flex key={index} justify="space-between" align="center">
                <Text fontSize="sm" noOfLines={1}>
                  {file.name}
                </Text>
                <IconButton
                  colorScheme="transparent"
                  icon={<Close />}
                  aria-label="close"
                  onClick={() => handleRemoveFile(index)}
                />
              </Flex>
            ))}
            <Button
              ml="auto"
              background="blue.500"
              color="white"
              onClick={handleSubmit}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : 'Импортировать'}
            </Button>
          </Flex>
        )}
      </Flex>
    </ContainerApp>
  )
}

export default UploadPage
