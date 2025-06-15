// import React from 'react'
// import { Button } from '@/components/ui/button';

// function StepProgress({ stepCount, setStepCount, data }) {
//   return (
//     <div className='flex gap-5 items-center'>
//       {stepCount != 0 && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setStepCount(stepCount - 1)}
//         >
//           Prev
//         </Button>
//       )}

//       {data?.map((item, index) => {
//         return ( // ✅ Added return statement
//           <div
//             key={index}
//             className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}
//           >
//           </div>
//         )
//       })}

//       {stepCount < data?.length - 1 && (
//         <Button
//           variant='outline'
//           size='sm'
//           onClick={() => setStepCount(stepCount + 1)}
//         >
//           Next
//         </Button>
//       )}
//     </div>
//   )
// }

// export default StepProgress

import React from 'react'
import { Button } from '@/components/ui/button';

function StepProgress({ stepCount, setStepCount, data }) {
  return (
    <div className='bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6'>
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 items-center'>
        {/* Previous Button - Responsive sizing */}
        {stepCount != 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStepCount(stepCount - 1)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium order-2 sm:order-1"
          >
            Prev
          </Button>
        )}

        {/* Progress Steps - Responsive container */}
        <div className="flex-1 w-full order-1 sm:order-2">
          <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
            {data?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex-1 h-2 sm:h-3 lg:h-4 rounded-full transition-all duration-300 ${index <= stepCount ? 'bg-primary shadow-sm' : 'bg-gray-200'
                    }`}
                >
                </div>
              )
            })}
          </div>

          {/* Step Counter - Mobile friendly */}
          <div className="text-center mt-2 sm:mt-3">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Step {stepCount + 1} of {data?.length}
            </span>
          </div>
        </div>

        {/* Next Button - Responsive sizing */}
        {stepCount < data?.length - 1 && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setStepCount(stepCount + 1)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium order-3"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

export default StepProgress