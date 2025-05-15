'use client';

import Image from 'next/image';
import { Author } from '@/constants/mockData';

interface CommentAuthorProps {
  author: {
    username: string;
    avatar: string | null;
  }
}

const CommentAuthor = ({ author }: CommentAuthorProps) => {
  return (
    <Image
      src={author.avatar || "https://avatar.iran.liara.run/public/22"}
      alt={author.username}
      fill
      className="!relative object-cover max-w-6 max-h-6 rounded-full"
    />
  );
};

export default CommentAuthor;