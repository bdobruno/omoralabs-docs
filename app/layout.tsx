import { RootProvider } from "fumadocs-ui/provider/next";
import { Toaster } from "sonner";
import "./global.css";

export const metadata = {
  metadataBase: new URL("https://docs.omoralabs.com"),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Toaster />
      </body>
    </html>
  );
}
