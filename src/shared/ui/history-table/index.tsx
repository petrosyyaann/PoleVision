import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Flex, Box } from '@chakra-ui/react'
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

interface DataRow {
  id: number
  time: string
  fileName: string
  status: string
  classes: string
  preview: boolean
}

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

  return (
    <Box w="100%" overflowX="auto" p={4} borderRadius="md">
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
              onClick={() => navigate(`/file/${row.original.id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <Td p={2} key={cell.id} textAlign="center">
                  <Flex justifyContent="center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Flex>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
