import { Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      w="100svw"
      h="100svh"
      bg="blue.100"
      direction="row"
      justify="center"
      pt="30px"
    >
      {children}
    </Flex>
  )
}
