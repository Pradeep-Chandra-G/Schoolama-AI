// import React, { useState } from 'react'
// import Image from 'next/image'
// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { RefreshCcw } from 'lucide-react';

// function MaterialCardItem({ item, studyTypeContent, course }) {
//   const [loading, setLoading] = useState(false);

//   const GenerateContent = async () => {
//     try {
//       setLoading(true);
//       console.log('Course data:', course);

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

//       if (result)
//         setLoading(false);
//       else
//         setLoading(true);
//       console.log('Success:', result.data);

//     } catch (error) {
//       console.error('Error generating content:', error);
//       console.error('Error response:', error.response?.data);
//       alert('Failed to generate content. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Special handling for chat - it's always ready
//   const isChatType = item.type === 'chat';
//   const hasContent = isChatType || (studyTypeContent?.[item.type] &&
//     Array.isArray(studyTypeContent[item.type]) &&
//     studyTypeContent[item.type].length > 0);

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
//       {/* Status Badge - Responsive positioning */}
//       <div className="relative p-4 sm:p-5 lg:p-6">
//         <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
//           {!hasContent ?
//             <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
//               Generate
//             </span>
//             :
//             <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
//               Ready
//             </span>
//           }
//         </div>

//         {/* Icon - Responsive sizing */}
//         <div className="flex justify-center mb-3 sm:mb-4">
//           <Image
//             src={item.icon}
//             width={60}
//             height={60}
//             className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
//             alt={item.name}
//           />
//         </div>

//         {/* Content - Responsive text and spacing */}
//         <div className="text-center space-y-2 sm:space-y-3">
//           <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
//             {item.name}
//           </h3>

//           <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed px-2">
//             {item.desc}
//           </p>
//         </div>

//         {/* Action Button - Responsive sizing */}
//         <div className="mt-4 sm:mt-5 lg:mt-6">
//           {!hasContent ?
//             <Button
//               onClick={GenerateContent}
//               disabled={loading}
//               className="w-full text-sm sm:text-base py-2 sm:py-2.5 lg:py-3 font-medium"
//               variant="outline"
//             >
//               {loading && <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />}
//               {loading ? 'Generating...' : 'Generate'}
//             </Button>
//             :
//             <Button className="w-full text-sm sm:text-base py-2 sm:py-2.5 lg:py-3 font-medium">
//               {isChatType ? 'Access Chat' : 'View'}
//             </Button>
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MaterialCardItem

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { RefreshCcw } from 'lucide-react';

function MaterialCardItem({ item, studyTypeContent, course }) {
  const [loading, setLoading] = useState(false);

  const GenerateContent = async () => {
    try {
      setLoading(true);
      console.log('Course data:', course);

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

      if (result)
        setLoading(false);
      else
        setLoading(true);
      console.log('Success:', result.data);

    } catch (error) {
      console.error('Error generating content:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Determine content availability based on item type
  const getContentStatus = () => {
    // Special handling for chat - it's always ready
    if (item.type === 'chat') {
      return { hasContent: true, isChat: true };
    }

    // For other types, check if content exists
    const hasContent = studyTypeContent?.[item.type] &&
      Array.isArray(studyTypeContent[item.type]) &&
      studyTypeContent[item.type].length > 0;

    return { hasContent, isChat: false };
  };

  const { hasContent, isChat } = getContentStatus();

  // Determine button text and action
  const getButtonConfig = () => {
    if (!hasContent) {
      return {
        text: loading ? 'Generating...' : 'Generate',
        action: GenerateContent,
        disabled: loading,
        variant: 'outline'
      };
    }

    // Content is ready
    if (isChat) {
      return {
        text: 'Start Chat',
        action: () => {/* Handle chat navigation */ },
        disabled: false,
        variant: 'default'
      };
    }

    return {
      text: 'View',
      action: () => {/* Handle view navigation */ },
      disabled: false,
      variant: 'default'
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
      {/* Status Badge - Responsive positioning */}
      <div className="relative p-4 sm:p-5 lg:p-6">
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          {!hasContent ? (
            <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
              Generate
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
              Ready
            </span>
          )}
        </div>

        {/* Icon - Responsive sizing */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <Image
            src={item.icon}
            width={60}
            height={60}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
            alt={item.name}
          />
        </div>

        {/* Content - Responsive text and spacing */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
            {item.name}
          </h3>

          <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed px-2">
            {item.desc}
          </p>
        </div>

        {/* Action Button - Responsive sizing */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <Button
            onClick={buttonConfig.action}
            disabled={buttonConfig.disabled}
            className="w-full text-sm sm:text-base py-2 sm:py-2.5 lg:py-3 font-medium"
            variant={buttonConfig.variant}
          >
            {loading && (
              <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
            )}
            {buttonConfig.text}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MaterialCardItem