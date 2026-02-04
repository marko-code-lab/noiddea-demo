import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "./session-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('🔍 [Providers] Rendering providers')
  
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
