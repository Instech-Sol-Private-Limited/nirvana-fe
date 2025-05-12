'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AddThreadModal from '../dialogs/AddThreadModal';
import PrimaryButton from '../addons/PrimaryButton';

const NewThreadCard: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="bg-teal-600 rounded-lg p-4">
        <h2 className="text-white md:text-base text-sm font-medium">Start a Discussion</h2>

        <p className="text-teal-200 md:text-sm text-xs mt-2">
          Have a question or want to share something with the community? Start a new thread to get the conversation going.
        </p>

        <PrimaryButton
          type="submit"
          className=' md:!text-sm !text-xs !py-2 !px-4 mt-4'
          onClick={() => setIsOpen(true)}
          text={'Create New Thread'}
          center={false}
        />
      </div>

      <AddThreadModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default NewThreadCard;
