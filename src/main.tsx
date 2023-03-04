import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { ChakraProvider } from '@chakra-ui/react'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/Root"
import Markets from "./routes/Markets"
import CreateMarket from "./routes/CreateMarket"
import Lend from "./routes/Lend"

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
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.StrictMode>,
)
