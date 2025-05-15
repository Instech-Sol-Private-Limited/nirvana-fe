'use client';

import Image from 'next/image';

interface CommentContentProps {
  content: string;
  images?: string[];
}

const CommentContent = ({ content, images = [] }: CommentContentProps) => {

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div>
      <div className="text-gray-100 text-sm whitespace-pre-wrap break-words">
        {renderText(content)}
      </div>

      {images && images.length > 0 && (
        <div className="w-full mt-3 flex items-center gap-2">
          {images.map((image, index) => (
            <div key={index} className="aspect-video w-20 relative rounded-md h-20 overflow-hidden border border-gray-600">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentContent;