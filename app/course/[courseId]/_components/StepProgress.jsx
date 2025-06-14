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
//             className={`w-full h-2 rounded-full ${index < stepCount ? 'bg-primary' : 'bg-gray-200'}`}
//           >
//           </div>
//         )
//       })}

//       {stepCount < data?.length && (
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
    <div className='flex gap-5 items-center'>
      {stepCount != 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepCount(stepCount - 1)}
        >
          Prev
        </Button>
      )}

      {data?.map((item, index) => {
        return ( // ✅ Added return statement
          <div
            key={index}
            className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}
          >
          </div>
        )
      })}

      {stepCount < data?.length - 1 && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => setStepCount(stepCount + 1)}
        >
          Next
        </Button>
      )}
    </div>
  )
}

export default StepProgress