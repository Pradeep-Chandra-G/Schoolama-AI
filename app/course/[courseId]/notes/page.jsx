"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useRouter } from 'next/navigation'

function ViewNotes() {
    const { courseId } = useParams();
    const [notes, setNotes] = useState();
    const [stepCount, setStepCount] = useState(1);
    const route = useRouter();
    useEffect(() => {
        GetNotes();
    }, [])

    const GetNotes = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'notes'
        });
        console.log(result?.data);
        setNotes(result?.data);
    }

    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            )
        },
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-blue-50">
                {children}
            </blockquote>
        ),
        ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-gray-700">
                {children}
            </li>
        ),
    };

    return notes && (
        <div className="max-w-4xl mx-auto p-6">
            {/* Navigation */}
            <div className='flex gap-5 items-center mb-8'>
                {stepCount != 1 && (
                    <Button variant='outline' size='sm' onClick={() => setStepCount(stepCount - 1)}>
                        Previous
                    </Button>
                )}
                <div className="flex gap-2 flex-1">
                    {notes?.map((item, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-2 rounded-full transition-colors duration-200 ${
                                index < stepCount ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        ></div>
                    ))}
                </div>
                {stepCount < notes?.length && (
                    <Button variant='outline' size='sm' onClick={() => setStepCount(stepCount + 1)}>
                        Next
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                >
                    {(notes[stepCount - 1]?.notes?.markdownContent || '').replace(/\\n/g, '\n')}
                </ReactMarkdown>
            </div>

            {/* Page indicator */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Page {stepCount} of {notes?.length}
            </div>

            {notes?.length == stepCount && <div className='flex items-center gap-10 flex-col justify-center'>
                <h2>End of notes</h2>    
                <Button type="button" onClick={() => route.back()} >Go to Course Page</Button>
            </div>}
        </div>
    )
}

export default ViewNotes