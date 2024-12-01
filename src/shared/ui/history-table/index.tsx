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
import { DataRow } from 'pages/home'
import { useNavigate } from 'react-router-dom'

interface TableProps {
  data: DataRow[]
  columns: ColumnDef<DataRow>[]
}

export const HistoryTable: React.FC<TableProps> = ({ data, columns }) => {
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
                onClick={() => navigate(`/file/${row.original.id}`)}
                cursor={row.original.status === 'completed' ? 'pointer' : ''}
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
