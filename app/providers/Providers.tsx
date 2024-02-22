"use client"

import { ReactNode } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function Provider({ children }: { children: ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}