"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

type TClientProviders = PropsWithChildren;

export default function ClientProviders({ children }: TClientProviders) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 15,
            retry: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer position="bottom-left" />
    </QueryClientProvider>
  );
}
