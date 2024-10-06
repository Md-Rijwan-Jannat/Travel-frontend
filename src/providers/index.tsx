"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

import { persistor, store } from "../redux/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <Provider store={store}>
        <Toaster />
        <PersistGate loading={null} persistor={persistor}>
          <NextThemesProvider
            {...themeProps}
            attribute="class"
            defaultTheme="system"
          >
            {children}
          </NextThemesProvider>
        </PersistGate>
      </Provider>
    </NextUIProvider>
  );
}
