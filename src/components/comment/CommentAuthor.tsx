'use client';

import Image from 'next/image';
import { Author } from '@/constants/mockData';

interface CommentAuthorProps {
  author: Author;
}

const CommentAuthor = ({ author }: CommentAuthorProps) => {
  return (
    <Image
      src={author.avatar || "https://avatar.iran.liara.run/public/22"}
      alt={author.username}
      width={40}
      height={40}
      className="object-cover"
    />
  );
};

export default CommentAuthor;