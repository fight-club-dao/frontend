import { useState } from 'react'
import '../App.css'  
        
import { Heading } from '@chakra-ui/react'
import { Center } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { Button, Link, LinkOverlay } from "@chakra-ui/react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import { ConnectButton } from '@rainbow-me/rainbowkit';

function CreateMarket() {
  const [accordionIndex, setAccordionIndex] = useState(0)

  return (
    <Box className="MainPageContainer">
      <Box className='FightClubMain'>
        <Box className="ConnectButtonContainer">
            <ConnectButton />
        </Box>
        <Center h="100vh">
          <Accordion className="CreateMarketAccordion" index={[accordionIndex]} allowMultiple> 
            <AccordionItem isDisabled={accordionIndex !== 0}> 
              <h2> 
                <AccordionButton> 
                  <Box as="span" flex='1' textAlign='left'> Create Proposal </Box> 
                </AccordionButton> 
              </h2> 
              <AccordionPanel pb={4}> 
                <LinkOverlay href="https://snapshot.org/#/marketmakersdao.eth" isExternal>
                  <Button onClick={() => setAccordionIndex(1)} className='MainButton' style={{width: "20vw"}}>Create a Fight Club DAO Proposal</Button>
                </LinkOverlay>
              </AccordionPanel> 
            </AccordionItem> 
            <AccordionItem isDisabled={accordionIndex !== 1}> 
              <h2> 
                <AccordionButton> 
                  <Box as="span" flex='1' textAlign='left'> Start Betting </Box> 
                </AccordionButton> 
              </h2> 
              <AccordionPanel pb={4}> 
                Once your proposal is approved you'll be able to bet <Link href="/markets">here</Link>.
              </AccordionPanel> 
              </AccordionItem> 
          </Accordion>
        </Center>
      </Box>
    </Box>
  )
}

export default CreateMarket