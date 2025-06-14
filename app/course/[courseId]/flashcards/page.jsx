"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import FlashCardItem from './_components/FlashCardItem';
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel"
import { useRouter } from 'next/navigation';

function Flashcards() {
    const {courseId} = useParams();
    const [flashcards, setFlashCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState({});
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [carouselApi, setCarouselApi] = useState(null);
    const route = useRouter();

    useEffect(() => {
        GetFlashCards();
    }, [])
    
    useEffect(() => {
        if (!carouselApi) return;
        
        carouselApi.on("select", () => {
            setCurrentCardIndex(carouselApi.selectedScrollSnap());
        });
    }, [carouselApi])
    
    const GetFlashCards = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'Flashcard'
        });
        
        setFlashCards(result?.data);
        console.log('Flashcard: ', result.data);
    }

    const handleClick = (cardIndex) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardIndex]: !prev[cardIndex]
        }));
    }

    // Extract the actual flashcard content from the nested structure
    const flashcardContent = flashcards?.[0]?.content || [];

    return (
        <div>
            <h2 className='font-bold text-2xl'>Flashcards</h2>
            <p>Flashcards: The Ultimate Tool to Lock in Concepts!</p>
            
            <div className='mt-10 px-4'>
                <div className='max-w-4xl mx-auto'>
                    <Carousel className="w-full" setApi={setCarouselApi}>
                        <CarouselContent className="-ml-1">
                            {flashcardContent.map((flashcard, index) => (
                                <CarouselItem key={index} className="pl-1 basis-full flex justify-center">
                                    <FlashCardItem 
                                        handleClick={() => handleClick(index)} 
                                        isFlipped={flippedCards[index] || false} 
                                        flashcard={flashcard}
                                        cardIndex={index}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>
                </div>
                
                {/* Card counter */}
                <div className='text-center mt-4 text-sm text-gray-600'>
                    Card {currentCardIndex + 1} of {flashcardContent.length}
                </div>
                {/* {flashcardContent.length == currentCardIndex - 2 && <div className='flex items-center gap-10 flex-col justify-center'>
                    <h2>End of notes</h2>    
                    <Button type="button" onClick={() => route.back()} >Go to Course Page</Button>
                </div>} */}
                {currentCardIndex === flashcardContent.length - 1 && (
                    <div className='flex items-center gap-10 flex-col justify-center mt-6'>
                        <h2 className='text-lg font-semibold'>End of Flashcards</h2>    
                        <Button type="button" onClick={() => route.back()}>
                        Go to Course Page
                        </Button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Flashcards