import React from 'react';
import ReactCardFlip from 'react-card-flip';

function FlashCardItem({ flashcard, isFlipped, handleClick }) {
    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection='vertical'>
            {/* Front of the card */}
            <div className='p-4 bg-primary shadow-lg text-white flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]' onClick={handleClick}>
                <h2 className='text-center text-sm md:text-base'>
                    {flashcard?.front}
                </h2>
            </div>
            
            {/* Back of the card */}
            <div className='p-4 bg-primary shadow-lg text-white flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]' onClick={handleClick}>
                <p className='text-center text-xs md:text-sm'>
                    {flashcard?.back}
                </p>
            </div>
        </ReactCardFlip>
    );
}

export default FlashCardItem;