// import React, { useState } from 'react'
// import Image from 'next/image'
// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { RefreshCcw } from 'lucide-react';

// function MaterialCardItem({item, studyTypeContent, course}) {
//   const [loading, setLoading] = useState(false);
  
//   const GenerateContent = async () => {
//     try {
//       setLoading(true);
//       console.log('Course data:', course);
      
//       // Fix: Better way to build chapters string
//       let chapters = '';
//       if (course?.courseLayout?.list_of_chapters) {
//         chapters = course.courseLayout.list_of_chapters
//           .map(chapter => chapter.chapter_title)
//           .join(',');
//       }
      
//       console.log('Chapters:', chapters);
//       console.log('Sending payload:', {
//         courseId: course?.courseId,
//         type: item.name,
//         chapters: chapters
//       });

//       const result = await axios.post('/api/study-type-content', {
//         courseId: course?.courseId,
//         type: item.name,
//         chapters: chapters
//       });
      
//       if(result)
//         setLoading(false);
//       else
//         setLoading(true);
//       console.log('Success:', result.data);
      
//       // You might want to refresh the parent component here
      
//     } catch (error) {
//       console.error('Error generating content:', error);
//       console.error('Error response:', error.response?.data);
      
//       // Optional: Show user-friendly error message
//       alert('Failed to generate content. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   console.log("Study Type Content: ", studyTypeContent);
  

//   return (
    
//     <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${
//       studyTypeContent?.[item.type]?.length == 0 && 'grayscale'
//     }`}>
//       {studyTypeContent?.[item.type]?.length == null ? 
//         <h2 className='p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2'>Generate</h2>
//         : <h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>Ready</h2>
//       }
      
//       <Image src={item.icon} alt={item.name} width={50} height={50}/>
//       <h2 className='font-medium mt-3'>{item.name}</h2>
//       <p className='text-gray-500 text-sm text-center'>{item.desc}</p>

//       {studyTypeContent?.[item.type]?.length == null ? 
//         <Button 
//           className='mt-3 w-full' 
//           variant="outline" 
//           onClick={GenerateContent}
//           disabled={loading}
//         >
//           {loading && <RefreshCcw className='animate-spin mr-2' size={16}/>}
//           {loading ? 'Generating...' : 'Generate'}
//         </Button>
//         : <Button className='mt-3 w-full' variant="outline">View</Button>
//       }
//     </div>
//   )
// }

// export default MaterialCardItem



import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { RefreshCcw } from 'lucide-react';

function MaterialCardItem({item, studyTypeContent, course}) {
  const [loading, setLoading] = useState(false);
  
  const GenerateContent = async () => {
    try {
      setLoading(true);
      console.log('Course data:', course);
      
      // Fix: Better way to build chapters string
      let chapters = '';
      if (course?.courseLayout?.list_of_chapters) {
        chapters = course.courseLayout.list_of_chapters
          .map(chapter => chapter.chapter_title)
          .join(',');
      }
      
      console.log('Chapters:', chapters);
      console.log('Sending payload:', {
        courseId: course?.courseId,
        type: item.name,
        chapters: chapters
      });

      const result = await axios.post('/api/study-type-content', {
        courseId: course?.courseId,
        type: item.name,
        chapters: chapters
      });
      
      if(result)
        setLoading(false);
      else
        setLoading(true);
      console.log('Success:', result.data);
      
      // You might want to refresh the parent component here
      
    } catch (error) {
      console.error('Error generating content:', error);
      console.error('Error response:', error.response?.data);
      
      // Optional: Show user-friendly error message
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  console.log("Study Type Content: ", studyTypeContent);
  
  // Check if content exists and has data
  const hasContent = studyTypeContent?.[item.type] && 
                    Array.isArray(studyTypeContent[item.type]) && 
                    studyTypeContent[item.type].length > 0;

  return (
    
    <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${
      !hasContent && 'grayscale'
    }`}>
      {!hasContent ? 
        <h2 className='p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2'>Generate</h2>
        : <h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>Ready</h2>
      }
      
      <Image src={item.icon} alt={item.name} width={50} height={50}/>
      <h2 className='font-medium mt-3'>{item.name}</h2>
      <p className='text-gray-500 text-sm text-center'>{item.desc}</p>

      {!hasContent ? 
        <Button 
          className='mt-3 w-full' 
          variant="outline" 
          onClick={GenerateContent}
          disabled={loading}
        >
          {loading && <RefreshCcw className='animate-spin mr-2' size={16}/>}
          {loading ? 'Generating...' : 'Generate'}
        </Button>
        : <Button className='mt-3 w-full' variant="outline">View</Button>
      }
    </div>
  )
}

export default MaterialCardItem