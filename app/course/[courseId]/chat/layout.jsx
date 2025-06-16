import { Inter } from 'next/font/google';
import '../../../globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'AI Chatbot - Your Intelligent Assistant',
    description: 'A smart AI chatbot powered by Groq for conversations, calculations, and more.',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} h-full antialiased`}>
                {children}
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        className: 'text-sm',
                    }}
                />
            </body>
        </html>
    );
}