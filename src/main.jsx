import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {AuthProvider} from "/src/lib/auth-context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import './styles/index.css'
import '/src/styles/globals.css'
import "/src/styles/tailwind.min.css"
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import './lib/i18n';

import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google";


const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
   <StrictMode>
      <GoogleOAuthProvider clientId={"55199886281-pan6koe07p17be6k4f4krptoud9t926g.apps.googleusercontent.com"}>
      <AuthProvider> {/* 일단 로그인 인증,인가 스프링 시큐리티로 구현할 것이라 예상하고 이렇게 설정합니당 */}
         <QueryClientProvider client={queryClient}>
            <App/>
         </QueryClientProvider>
      </AuthProvider>
      </GoogleOAuthProvider>
   </StrictMode>,
)
