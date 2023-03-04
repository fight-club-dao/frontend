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

const displayTableElements = (): React.ReactElement[] => {
    let TRArray = [];

    for (let x = 0; x < 20; x++) {
        TRArray.push(
        <Tr className="BrowseMarketsTableElement"> 
            <Td>1</Td> 
            <Td>Vitalik vs Amitay</Td> 
            <Td>RPS</Td> 
            <Td>2:1</Td>
            <Td>$500</Td>
            <Td>$1000</Td>
        </Tr>
        );
    }

    return TRArray;
}

function Markets() {
  const [count, setCount] = useState(0)

  return (
    <Box className="MainPageContainer">
      <Box className='FightClubMain'>
        <Center h="100vh">
            <TableContainer maxHeight="100vh" maxWidth="100vw" overflowY="scroll" minW="100vw"> 
                <Table variant='simple' size="lg"> 
                    {/*<TableCaption>Imperial to metric conversion factors</TableCaption>*/} 
                    <Thead> 
                        <Tr> 
                            <Th className="BrowseMarketsTableHead">Market Id</Th> 
                            <Th className="BrowseMarketsTableHead">Name</Th> 
                            <Th className="BrowseMarketsTableHead">Type</Th> 
                            <Th className="BrowseMarketsTableHead">Odds</Th> 
                            <Th className="BrowseMarketsTableHead">$ Token 1</Th> 
                            <Th className="BrowseMarketsTableHead">$ Token 2</Th> 
                        </Tr> 
                    </Thead> 
                    <Tbody> 
                        {displayTableElements()}
                    </Tbody> 
                    {/*<Tfoot> 
                        <Tr> 
                            <Th>To convert</Th> 
                            <Th>into</Th> 
                            <Th isNumeric>multiply by</Th> 
                        </Tr> 
                    </Tfoot> */}
                </Table> 
            </TableContainer>
        </Center>
      </Box>
    </Box>
  )
}

export default Markets