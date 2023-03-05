import { useState, useEffect } from 'react'
import '../App.css'  
        
import qs from "qs";
import BigNumber from "bignumber.js"

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

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/react'

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

const displayTableElements = (signer: ethers.Signer | undefined, stats: any[], prizes: any, eligible: any, toast: any, isOpen: boolean, onOpen: () => void, onClose: () => void, setCurrentStat: any, setTokenIndex: any): React.ReactElement[] => {
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
        let contract = new ethers.Contract("0xDF11378E7f5708Bab56c8925E086096Fa54E378C", PredictionMarketABI, signer);
        
        try {
            await contract.claimAndRemoveLiquidity(id, 0);
        } catch (e) {
            let message
            if (e instanceof Error) message = e.message
            else message = String(e)

            toast({
                title: 'Claim Failed',
                description: message,
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
            <Td>{indexOfStat + 1}</Td> 
            <Td>{`${stat[0][2]} vs ${stat[1][2]}`}</Td> 
            <Td>🪨📜✂️</Td> 
            <Td>{`${calculateRatio(Math.floor(prizes[indexOfStat]?.[0] / 100000), Math.floor(prizes[indexOfStat]?.[1] / 100000))}`}</Td>
            <Td className="BrowseMarketsTableElementToken"><Button w="10vw" className="MainButton" isDisabled={stat[2] !== 0} onClick={() => { setCurrentStat(indexOfStat); setTokenIndex(0); onOpen(); }}>Buy {stat[0][2]}</Button></Td>
            <Td className="BrowseMarketsTableElementToken"><Button w="10vw" className="MainButton" isDisabled={stat[2] !== 0} onClick={() => { setCurrentStat(indexOfStat); setTokenIndex(1); onOpen(); }}>Buy {stat[1][2]}</Button></Td>
            <Td>{getStatus(stat[3])}</Td>
            <Td><Button w="10vw" isDisabled={!eligible[indexOfStat]} onClick={() => claim(indexOfStat + 1)} className="MainButton">Claim</Button></Td>
            <Td>{stat[2] == 0 ? "Undecided" : stat[2] == 1 ? stat[0][2] : stat[1][2]}</Td>
        </Tr>
        );
    }

    return TRArray;
}

const executeSwap = async (quote: any) => {
    const txParams = {
      ...quote,
      value: new BigNumber(quote.value).toString(16), // Convert value to hexadecimal
      gas: new BigNumber(quote.gas).toString(16), // Convert gas to hexadecimal
      gasPrice: new BigNumber(quote.gasPrice).toString(16) // Convert gasPrice to hexadecimal
    };
  
    // Execute trade directly with Metamask
    try {
      const ethereum = (window as any).ethereum;
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams]
      });
    } catch {
        
    }
};

const swapETHToUSDC = async (signer: ethers.Signer | undefined) => {
    const ZERO_EX_ADDRESS = '0xf91bb752490473b8342a3e964e855b9f9a2a668e';
    const USDC_ADDRESS = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

    // Selling 0.001 ETH for USDC.
    const params = {
        sellToken: "ETH",
        buyToken: USDC_ADDRESS,
        // Note that the DAI token uses 18 decimal places, so `sellAmount` is `0.001 * 10^18`.    
        sellAmount: '1000000000000000',
        chainId: 5,
        takerAddress: await signer?.getAddress(),
    }

    // Fetch the swap quote.
    const response = await fetch(
        `https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
    );

    // Perform the swap.
    let quote = await response.json();

    await executeSwap(quote);
}

const swapUSDCToPoolToken = async (signer: ethers.Signer | undefined, tokenAddress: string) => {
    const ZERO_EX_ADDRESS = '0xf91bb752490473b8342a3e964e855b9f9a2a668e';
    const USDC_ADDRESS = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

    // Selling 0.001 ETH for USDC.
    const params = {
        sellToken: USDC_ADDRESS,
        buyToken: tokenAddress,
        // Note that the USDC token uses 6 decimal places, so `sellAmount` is `10 * 10^6`.    
        sellAmount: '10000000',
        chainId: 5,
        takerAddress: await signer?.getAddress(),
    }

    const usdc = new ethers.Contract(USDC_ADDRESS, ERC20ABI, signer);
    const currentAllowance = await usdc.allowance(params.takerAddress, ZERO_EX_ADDRESS);
    if (currentAllowance.lt(params.sellAmount)) {
        await usdc.approve(ZERO_EX_ADDRESS, params.sellAmount)
    }

    // Fetch the swap quote.
    const response = await fetch(
        `https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
    );

    // Perform the swap.
    let quote = await response.json();

    console.log(quote);

    await executeSwap(quote);
}

function Markets() {
  const [count, setCount] = useState(0)
  const [stats, setStats] = useState(Array<any>)
  const [prizes, setPrizes] = useState(Array<any>)
  const [eligible, setEligible] = useState(Array<any>)
  const [currentStat, setCurrentStat] = useState(0)
  const [currentTokenIndex, setTokenIndex] = useState(0)

  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  setTimeout(() => setCount(count + 1), 5000);

  useEffect(() => {
    const getStats = async (provider: ethers.providers.BaseProvider) => {
        let statsInfo: any[] = [];
        let stats = 1;
    
        let contract = new ethers.Contract("0x538d01D671293eC4173031bF8DCCf2cf10C778a2", PMHelperABI, provider);
    
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
        let prize = 1;
    
        let contract = new ethers.Contract("0x538d01D671293eC4173031bF8DCCf2cf10C778a2", PMHelperABI, provider);
    
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

  const { isOpen, onOpen, onClose } = useDisclosure()
  
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
                            <Th className="BrowseMarketsTableHead">Winner</Th>
                        </Tr> 
                    </Thead> 
                    <Tbody> 
                        {displayTableElements(signer ?? undefined, stats, prizes, eligible, toast, isOpen, onOpen, onClose, setCurrentStat, setTokenIndex)}
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="MarketsBuyModal">
          <ModalHeader>Buy {stats?.[currentStat]?.[currentTokenIndex]?.[2]}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center h="100%">
                <VStack>
                    <Button w="15vw" onClick={() => swapETHToUSDC(signer ?? undefined)} className="MainButton">Swap ETH to USDC</Button>
                    <Button w="15vw" onClick={() => swapUSDCToPoolToken(signer ?? undefined, stats?.[currentStat]?.[currentTokenIndex]?.[0])} className="MainButton">Swap USDC to {stats?.[currentStat]?.[currentTokenIndex]?.[2]}</Button>
                    <Link href={`https://app.uniswap.org/#/swap?theme=dark&outputCurrency=${stats?.[currentStat]?.[currentTokenIndex]?.[0]}&network=goerli`} isExternal><Button w="15vw" className="MainButton">Buy Directly on Uniswap</Button></Link>
                </VStack>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button w="5vw" className="MainButton" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Markets