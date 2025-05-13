'use client';

import Image from 'next/image';

interface CommentContentProps {
  content: string;
  images?: string[];
}

const CommentContent = ({ content, images }: CommentContentProps) => {
  return (
    <>
      <p className="text-gray-300 whitespace-pre-line text-sm">
        {content}
      </p>

      {images && images.length > 0 && (
        <div
          className="mt-1 grid grid-cols-2 gap-1"
          style={{ width: '120px', height: '120px' }}
        >
          {images.map((image, index) => (
            <div key={index} className="rounded overflow-hidden">
              <Image
                src={image}
                alt={`Comment image ${index + 1}`}
                width={50}
                height={50}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CommentContent;