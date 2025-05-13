import React, { useEffect, useState } from 'react';
import ModalWrapper from '@/components/addons/WrapperModal';
import PrimaryButton from '../addons/PrimaryButton';
import { Thread } from '@/types';
import { toast } from 'react-toastify';
import { deleteThread } from '@/utils/threads';

interface AddThreadProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNewThread: () => void;
    selectedThread?: Thread | any;
}

const DeleteThreadModal: React.FC<AddThreadProps> = ({ isOpen, setIsOpen, onNewThread, selectedThread }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true)
            if (!selectedThread.id) {
                toast.error('Thread not selected');
            }

            const response = await deleteThread(selectedThread.id);

            if (response.success) {
                toast.success('Thread deleted Successfully!');
                setIsOpen(false);
                onNewThread()
            } else {
                toast.error(response.message || 'Failed to updated thread.');
            }

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while creating the thread.');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedThread.id) {
            setIsOpen(false);
        }
    }, [selectedThread])

    return (
        <ModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="max-w-[500px] w-11/12 flex flex-col"
            height=" h-fit"
        >
            <div className='w-full p-10'>
                <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-white mb-3 text-center">
                    Are you sure you want to remove thread?
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
                        onClick={handleDelete}
                        center={false}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default DeleteThreadModal;