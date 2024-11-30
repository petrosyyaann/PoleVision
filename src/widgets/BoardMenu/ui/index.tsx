import { useMatch, useNavigate } from 'react-router-dom'
import { Calendar, Edit, Tasks } from 'shared/iconpack'
import { Box, ButtonsNavigations, Flex } from 'shared/ui'

function BoardMenu() {
  const navigate = useNavigate()
  const isHome = useMatch('/home')
  const isFiles = useMatch('/files')
  const isUpload = useMatch('/')
  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'space-between'}
      align={'center'}
      h={'100%'}
      w={'100%'}
      pb={'30px'}
    >
      <Flex h={'100%'} flexDirection={'column'} align={'center'} gap="20px">
        <Box>
          <ButtonsNavigations
            title="Список изображений"
            Icon={Calendar}
            check={!!isHome}
            onClick={() => navigate('/home')}
          />
        </Box>
        <Box>
          <ButtonsNavigations
            title="Превью изображений"
            Icon={Tasks}
            check={!!isFiles}
            onClick={() => navigate('/files')}
          />
        </Box>
        <Box>
          <ButtonsNavigations
            title="Загрузка"
            Icon={Edit}
            check={!!isUpload}
            onClick={() => navigate('/')}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export { BoardMenu }
