import './polyfills.ts';
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { ChakraProvider } from '@chakra-ui/react'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import Root from "./routes/Root"
import Markets from "./routes/Markets"
import CreateMarket from "./routes/CreateMarket"
import Lend from "./routes/Lend"

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID ?? "" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Fight Club',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/markets",
    element: <Markets />
  },
  {
    path: "/create",
    element: <CreateMarket />
  },
  {
    path: "/lend",
    element: <Lend />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ChakraProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </React.StrictMode>,
)
