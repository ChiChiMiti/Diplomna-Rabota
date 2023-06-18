import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/auth-context";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Sidebar>
          <Component {...pageProps} />
        </Sidebar>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(App);
