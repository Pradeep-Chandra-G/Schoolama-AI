import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "./provider";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ContextWrapper from "./_context/ContextWrapper";
import "./globals.css";

export const metadata = {
  title: "SchooLama AI LMS",
  description: "AI-powered Learning Management System",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/sign-in"
    >
      <html lang="en">
        <body className={outfit.className}>
          <Provider>
            <ContextWrapper>{children}</ContextWrapper>
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
