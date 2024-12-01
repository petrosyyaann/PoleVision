import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  click?: boolean
}

export const HistoryTable = <T,>({
  data,
  columns,
  click = true,
}: TableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box w="100%" overflowX="auto" p={isMobile ? 4 : 0} borderRadius="md">
      {isMobile ? (
        <Box maxW="70svw">
          {table.getRowModel().rows.map((row) => (
            <Box
              key={row.id}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="md"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onClick={() => navigate(`/file/${row.original.id}`)}
              cursor="pointer"
              bg="gray.50"
              _hover={{ bg: 'gray.100' }}
            >
              {row.getVisibleCells().map((cell) => (
                <Flex
                  p={0}
                  w="100%"
                  key={cell.id}
                  justify="space-between"
                  mb={2}
                  _last={{ mb: 0 }}
                >
                  <Box fontWeight="bold" color="gray.600">
                    {cell.column.columnDef.id}
                  </Box>
                  <Box>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                </Flex>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Table colorScheme="gray">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr p={2} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th p={2} key={header.id} textAlign="center" color="#9896A9">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                p={2}
                key={row.id}
                // onClick={() =>
                //   row.original.status === 'completed'
                //     ? navigate(`/file/${row.original.id}`)
                //     : undefined
                // }
                onClick={() =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  click ? navigate(`/file/${row.original.id}`) : undefined
                }
                // cursor={row.original?.status === 'completed' ? 'pointer' : ''}
                _hover={{ bg: 'gray.100' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td p={2} key={cell.id} textAlign="center">
                    <Flex justifyContent="center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Flex>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}
