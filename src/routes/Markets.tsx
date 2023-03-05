import { useState, useEffect } from 'react'
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
import { Link } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'

import { ethers } from 'ethers';
import { useProvider, useSigner } from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit';

import PredictionMarketABI from "../../abi/PredictionMarketManager.json";
import PMHelperABI from "../../abi/PMHelper.json"
import ERC20ABI from "../../abi/ERC20.json"

const displayTableElements = (signer: ethers.Signer | undefined, stats: any[], prizes: any, eligible: any, toast: any): React.ReactElement[] => {
    let TRArray = [];

    const getStatus = (status: string): string => {
        switch (status) {
            case "BEFORE_START":
                return "Not Started"
            case "ON_GOING":
                return "Started"
            case "ENDED":
                return "Ended"
            default:
                return "Not Started"    
        }
    }

    const calculateRatio = (num_1: number, num_2: number) => {
        for(let num=num_2; num>1; num--) {
            if((num_1 % num) == 0 && (num_2 % num) == 0) {
                num_1=num_1/num;
                num_2=num_2/num;
            }
        }
        let ratio = num_1+":"+num_2;
        return ratio;
    }

    const claim = async (id: number) => {
        let contract = new ethers.Contract("0xB5478784f4f59F6EA54B046D0780859F994fbEfE", PredictionMarketABI, signer);
        
        try {
            await contract.claim(id);
        } catch (e) {
            toast({
                title: 'Claim Failed',
                description: "Transaction Not Permitted/Reverted",
                status: 'error',
                duration: 2500,
                isClosable: true,
            })
        }
    }

    for (let stat of stats) {
        let indexOfStat = stats.indexOf(stat);

        TRArray.push(
        <Tr className="BrowseMarketsTableElement"> 
            <Td>{stat[2]?.toNumber()}</Td> 
            <Td>{`${stat[0][2]} vs ${stat[1][2]}`}</Td> 
            <Td>🪨📜✂️</Td> 
            <Td>{`${calculateRatio(Math.floor(prizes[indexOfStat]?.[0] / 100000), Math.floor(prizes[indexOfStat]?.[1] / 100000))}`}</Td>
            <Td className="BrowseMarketsTableElementToken"><Link href={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${stat[0][0]}&network=goerli`} isExternal><Button w="10vw" className="MainButton">Buy {stat[0][2]}</Button></Link></Td>
            <Td className="BrowseMarketsTableElementToken"><Link href={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${stat[1][0]}&network=goerli`} isExternal><Button w="10vw" className="MainButton">Buy {stat[1][2]}</Button></Link></Td>
            <Td>{getStatus(stat[3])}</Td>
            <Td><Button w="10vw" isDisabled={!eligible[indexOfStat]} onClick={() => claim(indexOfStat)} className="MainButton">Claim</Button></Td>
        </Tr>
        );
    }

    return TRArray;
}

function Markets() {
  const [count, setCount] = useState(0)
  const [stats, setStats] = useState(Array<any>)
  const [prizes, setPrizes] = useState(Array<any>)
  const [eligible, setEligible] = useState(Array<any>)

  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  setTimeout(() => setCount(count + 1), 5000);

  useEffect(() => {
    const getStats = async (provider: ethers.providers.BaseProvider) => {
        let statsInfo: any[] = [];
        let stats = 0;
    
        let contract = new ethers.Contract("0x249024660B3bB5D24e65aaeA66edea6A81a1E2CB", PMHelperABI, provider);
    
        try {
            while(stats < Infinity) {
                let data = await contract.getStats(stats);
    
                statsInfo.push(data);
        
                stats++;
            }
        } catch {
            setStats(statsInfo);
        }
    }

    getStats(provider);
  }, [count]);

  useEffect(() => {
    const getPrize = async (provider: ethers.providers.BaseProvider) => {
        let prizeInfo: any[] = [];
        let prize = 0;
    
        let contract = new ethers.Contract("0x249024660B3bB5D24e65aaeA66edea6A81a1E2CB", PMHelperABI, provider);
    
        try {
            while(prize < Infinity) {
                let data = await contract.getCurrentTotalPrizes(prize);
    
                prizeInfo.push(data);
        
                prize++;
            }
        } catch {
            setPrizes(prizeInfo);
        }
    }

    getPrize(provider);
  }, [count]);

  useEffect(() => {
    if (stats.length == 0) return;

    const updateEligibleInfo = async () => {
        const determineIfEligibleForClaim = async (stat: any[]): Promise<boolean> => {
            let result = stat[2]?.toNumber();

            let contractSigner = signer ?? undefined;
    
            if (result !== 0) {
                let winningTokenIndex = result == 1 ? 0 : 1;
                let walletAddress = signer?.getAddress();
                let contract = new ethers.Contract(stat[winningTokenIndex][0], ERC20ABI, contractSigner);
    
                let tokenBalance = await contract.balanceOf(walletAddress);
    
                if (tokenBalance > 0) {
                    return true;
                }
            }
            return false;
        }
    
        let eligibleInfo: any[] = [];
    
        for (let stat of stats) {
            eligibleInfo.push(await determineIfEligibleForClaim(stat));
        }

        setEligible(eligibleInfo);
    }

    updateEligibleInfo()
  }, [count]);

  const toast = useToast();
  
  return (
    <Box className="MainPageContainer">
      <Box className='FightClubMain'>
        <Box className="ConnectButtonContainer">
            <ConnectButton />
        </Box>
        <Center h="100vh">
            <TableContainer maxHeight="100vh" maxWidth="100vw" overflowY="scroll" minW="100vw" className="BrowseMarketsTableContainer"> 
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
                            <Th className="BrowseMarketsTableHead">Status</Th> 
                            <Th className="BrowseMarketsTableHead">Claim</Th> 
                        </Tr> 
                    </Thead> 
                    <Tbody> 
                        {displayTableElements(signer ?? undefined, stats, prizes, eligible, toast)}
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