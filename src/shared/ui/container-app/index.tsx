import { Flex } from 'shared/ui'
import { ReactNode } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'

export const ContainerApp = ({ children }: { children: ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const margin = isMobile ? '15px' : '30px'
  return (
    <Flex
      overflow="auto"
      w="100%"
      bg="white"
      direction="column"
      borderRadius="20px"
      mb={margin}
      mr={margin}
      padding={isMobile ? '10px 15px 10px 15px' : '20px 30px 20px 30px'}
    >
      {children}
    </Flex>
  )
}
