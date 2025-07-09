import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function TopicInput({ setTopic, setDifficultyLevel }) {
    return (
        <div className='w-full space-y-6 sm:space-y-8 lg:space-y-10'>
            {/* Topic Input Section */}
            <div className='space-y-3 sm:space-y-4'>
                <h2 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800 leading-tight'>
                    Enter topic or paste the content for which you want to generate study material
                </h2>
                <Textarea
                    placeholder="Start writing here"
                    className="w-full min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] text-sm sm:text-base resize-none border-2 focus:border-primary transition-colors"
                    onChange={(event) => setTopic(event.target.value)}
                />
            </div>

            {/* Difficulty Level Section */}
            <div className='space-y-3 sm:space-y-4'>
                <h2 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800'>
                    Select the difficulty level
                </h2>
                <Select onValueChange={(value) => setDifficultyLevel(value)}>
                    <SelectTrigger className="w-full h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-primary">
                        <SelectValue placeholder="Choose difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Easy" className="text-sm sm:text-base py-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                Easy
                            </div>
                        </SelectItem>
                        <SelectItem value="Moderate" className="text-sm sm:text-base py-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                Moderate
                            </div>
                        </SelectItem>
                        <SelectItem value="Hard" className="text-sm sm:text-base py-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                Hard
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default TopicInput