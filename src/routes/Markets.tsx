import { useState } from 'react'
import '../App.css'  
        
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
            <VStack spacing="8">
                <Heading size="3xl">Fight Club</Heading>
                <VStack spacing="3">
                <HStack>
                    <Button className="MainButton">Browse Markets</Button>
                    <Button className="MainButton">Create Market</Button>
                </HStack>
                <Button className="MainButton">Lend</Button>
                </VStack>
            </VStack>
        </Center>
      </Box>
    </Box>
  )
}

export default Markets