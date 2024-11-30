import { Flex } from 'shared/ui'
import { Spinner } from '@chakra-ui/react'

const LoadingPage = () => {
  return (
    <Flex w="100svw" h="100svh" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  )
}

export default LoadingPage
