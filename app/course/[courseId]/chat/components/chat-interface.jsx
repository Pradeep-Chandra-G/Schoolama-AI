'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/app/course/[courseId]/chat/components/message';
import { Send, Loader2, Bot, Trash2, Download, Menu, X } from 'lucide-react';
import { useRef, useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        onError: (error) => {
            console.error('Chat error:', error);
            toast.error('Something went wrong. Please try again.');
        },
        onFinish: (message) => {
            console.log('Message finished:', message);
        },
    });

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [messageTimestamps, setMessageTimestamps] = useState({});

    // Generate timestamps for new messages
    const messagesWithTimestamps = useMemo(() => {
        const newTimestamps = { ...messageTimestamps };
        let hasNewMessages = false;

        const processedMessages = messages
            .filter(message => message.role === 'user' || message.role === 'assistant')
            .map(message => {
                if (!newTimestamps[message.id]) {
                    newTimestamps[message.id] = new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    hasNewMessages = true;
                }
                return {
                    ...message,
                    timestamp: newTimestamps[message.id]
                };
            });

        if (hasNewMessages) {
            setMessageTimestamps(newTimestamps);
        }

        return processedMessages;
    }, [messages, messageTimestamps]);



    // Debug logging
    useEffect(() => {
        console.log('Messages updated:', messages.length);
        console.log('Is loading:', isLoading);
        if (messages.length > 0) {
            console.log('Last message:', messages[messages.length - 1]);
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messagesWithTimestamps, isAtBottom]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
        setIsAtBottom(atBottom);
    };

    const clearChat = () => {
        setMessages([]);
        setMessageTimestamps({});
        toast.success('Chat cleared successfully');
        setIsMobileMenuOpen(false);
    };

    const exportChat = () => {
        const chatData = {
            messages: messagesWithTimestamps,
            exportedAt: new Date().toISOString(),
            totalMessages: messagesWithTimestamps.length,
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Chat exported successfully');
        setIsMobileMenuOpen(false);
    };

    const suggestedQuestions = [
        "What can you help me with?",
        "What's the weather like in New York?",
        "Calculate 15 * 24 + 8",
        "Tell me a fun fact",
        "How are you today?",
    ];

    const handleSuggestionClick = (suggestion) => {
        handleInputChange({ target: { value: suggestion } });
    };

    const handleFormSubmit = (e) => {
        console.log('Form submitted with input:', input);
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-b shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg sm:text-xl text-gray-800">Jedi</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                            Your intelligent conversation partner
                        </p>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportChat}
                        disabled={messages.length === 0}
                        className="text-xs"
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        disabled={messages.length === 0}
                        className="text-xs"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="sm:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white border-b shadow-sm p-3 space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportChat}
                        disabled={messages.length === 0}
                        className="w-full text-xs"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Chat
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        disabled={messages.length === 0}
                        className="w-full text-xs"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Chat
                    </Button>
                </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-hidden">
                <div
                    className="h-full overflow-y-auto px-3 sm:px-4 py-2 sm:py-4"
                    onScroll={handleScroll}
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
                            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 sm:mb-6">
                                <Bot className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                Welcome to AI Assistant
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md leading-relaxed">
                                I'm here to help you with questions, calculations, weather information, and engaging conversations. What would you like to know?
                            </p>

                            <div className="w-full max-w-md space-y-2 sm:space-y-3">
                                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Try asking me:
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {suggestedQuestions.map((question, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSuggestionClick(question)}
                                            className="text-xs sm:text-sm h-auto py-2 px-3 justify-start text-left whitespace-normal"
                                        >
                                            {question}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                            {messagesWithTimestamps.map((message) => (
                                <Message
                                    key={message.id}
                                    role={message.role}
                                    content={message.content}
                                    timestamp={message.timestamp}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span className="text-sm text-gray-600">AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white/80 backdrop-blur-sm border-t p-3 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleFormSubmit} className="space-y-2">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 min-h-[44px] text-sm sm:text-base"
                                maxLength={2000}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="min-w-[44px] h-[44px] sm:min-w-[48px] sm:h-[48px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Press Enter to send</span>
                            <span>{input.length}/2000</span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Scroll to bottom button */}
            {!isAtBottom && messages.length > 0 && (
                <Button
                    onClick={scrollToBottom}
                    className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg"
                    size="sm"
                >
                    ↓
                </Button>
            )}
        </div>
    );
}