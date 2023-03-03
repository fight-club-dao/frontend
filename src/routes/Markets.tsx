import { useState } from 'react'
import '../App.css'  
        
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

import { Heading } from '@chakra-ui/react'
import { Center } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function Markets() {
  const [count, setCount] = useState(0)

  return (
    <Box className="MainPageContainer">
      <Box className='FightClubMain'>
        <Center h="100vh">
            <TableContainer> 
                <Table variant='simple'> 
                    <TableCaption>Imperial to metric conversion factors</TableCaption> 
                    <Thead> 
                        <Tr> 
                            <Th>To convert</Th> 
                            <Th>into</Th> 
                            <Th isNumeric>multiply by</Th> 
                        </Tr> 
                    </Thead> 
                    <Tbody> 
                        <Tr> 
                            <Td>inches</Td> 
                            <Td>millimetres (mm)</Td> 
                            <Td isNumeric>25.4</Td> 
                        </Tr> 
                        <Tr> 
                            <Td>feet</Td> 
                            <Td>centimetres (cm)</Td> 
                            <Td isNumeric>30.48</Td> 
                        </Tr> 
                        <Tr> 
                            <Td>yards</Td> 
                            <Td>metres (m)</Td> 
                            <Td isNumeric>0.91444</Td> 
                        </Tr> 
                        </Tbody> 
                        <Tfoot> 
                            <Tr> 
                                <Th>To convert</Th> 
                                <Th>into</Th> 
                                <Th isNumeric>multiply by</Th> 
                            </Tr> 
                        </Tfoot> 
                </Table> 
            </TableContainer>
        </Center>
      </Box>
    </Box>
  )
}

export default Markets