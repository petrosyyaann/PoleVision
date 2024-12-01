import { Box, Flex, Text, Image, Tooltip } from '@chakra-ui/react'
import { getStatusInfo, Status } from 'shared/lib/getStatusInfo'
import fallbackImage from 'shared/iconpack/150.png'

interface PreviewCardProps {
  imageUrl: string
  status: string
  title: string
  onClick: () => void
}

export const PreviewCard = ({
  imageUrl,
  status,
  title,
  onClick,
}: PreviewCardProps) => {
  return (
    <Box
      // border="1px #D7D5E9 solid"
      background="#F9F9FA"
      borderRadius="15px"
      overflow="hidden"
      cursor={status === 'completed' ? 'pointer' : undefined}
      onClick={onClick}
      transition="transform 0.2s"
      _hover={{ transform: status === 'completed' ? 'scale(1.03)' : '' }}
    >
      {/* Превью изображения */}
      <Image
        src={imageUrl}
        alt={title}
        width="100%"
        height="150px"
        objectFit="cover"
        fallbackSrc={fallbackImage}
      />

      {/* Информация о файле */}
      <Flex direction="column" p={4}>
        <Tooltip label={title} hasArrow>
          <Text fontSize="lg" mb={2} isTruncated>
            {title}
          </Text>
        </Tooltip>
        <Flex
          justifyContent="center"
          fontWeight={600}
          bg={getStatusInfo(status as Status).bgColor}
          color="#373645"
          border={`1px solid ${getStatusInfo(status as Status).borderColor}`}
          px={2}
          py={1}
          w="-webkit-fit-content"
          borderRadius="20px"
          textAlign="center"
        >
          {getStatusInfo(status as Status).title}
        </Flex>
      </Flex>
    </Box>
  )
}
