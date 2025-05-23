'use client';

import React, { useState } from 'react';
import ModalWrapper from '@/components/addons/WrapperModal';
import PrimaryButton from '../addons/PrimaryButton';
import { AlertTriangle } from 'lucide-react';

interface AddThreadProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const DeleteCommentModal: React.FC<AddThreadProps> = ({ isOpen, setIsOpen, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  return (
    <ModalWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="max-w-[500px] w-11/12 flex flex-col"
      height=" h-fit"
    >
      <div className='w-full p-10'>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-900/20">
          <AlertTriangle className="h-6 w-6 text-teal-400" aria-hidden="true" />
        </div>
        <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-white mb-3 text-center">
          Are you sure you want to remove comment?
        </h1>

        <div className='w-full flex items-center justify-center gap-5 mt-12'>
          <PrimaryButton
            text='No'
            center={false}
            className='!bg-transparent !border-2 border-white !text-white !font-bold'
            onClick={() => setIsOpen(false)}
          />
          <PrimaryButton
            text='Yes'
            className='!border-2 border-white !font-bold'
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              await onConfirm();
              setLoading(false)
              setIsOpen(false);
            }}
            center={false}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteCommentModal;