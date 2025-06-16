'use client';

import { cn } from '@/lib/utils';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Message({ role, content, timestamp }) {
    const [copied, setCopied] = useState(false);

    const isUser = role === 'user';

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success('Message copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy message');
        }
    };

    return (
        <div className={cn(
            "flex gap-3 sm:gap-4 group",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                isUser
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
            )}>
                {isUser ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={cn(
                "flex-1 max-w-[85%] sm:max-w-[80%]",
                isUser ? "flex flex-col items-end" : "flex flex-col items-start"
            )}>
                <div className={cn(
                    "rounded-2xl px-3 py-2 sm:px-4 sm:py-3 relative group/message",
                    isUser
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white shadow-sm border"
                )}>
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {content}
                    </div>

                    {/* Copy button */}
                    <button
                        onClick={copyToClipboard}
                        className={cn(
                            "absolute top-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity",
                            "p-1 rounded hover:bg-black/10 sm:block hidden",
                            isUser ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {copied ? (
                            <Check className="w-3 h-3" />
                        ) : (
                            <Copy className="w-3 h-3" />
                        )}
                    </button>
                </div>

                {/* Timestamp */}
                <div className={cn(
                    "text-xs text-gray-500 mt-1 px-1",
                    isUser ? "text-right" : "text-left"
                )}>
                    {timestamp}
                </div>
            </div>
        </div>
    );
}