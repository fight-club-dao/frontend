import { useState } from 'react'
import '../App.css'  
        
import { Heading } from '@chakra-ui/react'
import { Center } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import { Outlet, Link } from "react-router-dom";

import { ConnectButton } from '@rainbow-me/rainbowkit';

function Root() {
  const [count, setCount] = useState(0)

  return (
    <Box className="MainPageContainer">
      <Box className='FightClubMain'>
        <Box className="ConnectButtonContainer">
            <ConnectButton />
        </Box>
        <Center h="100vh">
            <VStack spacing="8">
                <Heading size="3xl">Fight Club</Heading>
                <VStack spacing="3">
                <HStack>
                    <Button className="MainButton"><Link to="/markets">Browse Markets</Link></Button>
                    <Button className="MainButton"><Link to="/create">Create Market</Link></Button>
                </HStack>
                <Button className="MainButton"><Link to="/lend">Lend</Link></Button>
                </VStack>
            </VStack>
        </Center>
      </Box>
    </Box>
  )
}

export default Root