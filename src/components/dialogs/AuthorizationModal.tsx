import React from 'react';
import ModalWrapper from '@/components/addons/WrapperModal';
import PrimaryButton from '../addons/PrimaryButton';
import { useRouter } from 'next/navigation';

interface AuthorizationModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({ isOpen, setIsOpen, }) => {
    const router = useRouter();

    const handleLogin = () => {
        setIsOpen(false);
        router.push('/login');
    }

    return (
        <ModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="max-w-[500px] w-11/12 flex flex-col"
            height=" h-fit"
        >
            <div className='w-full p-10'>
                <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-white mb-3 text-center">
                    It seems you are not logged in. Please log in to continue.
                </h1>

                <div className='w-full flex items-center justify-center gap-5 mt-12'>
                    <PrimaryButton
                        text='Close'
                        center={false}
                        className='!bg-transparent !border-2 border-white !text-white !font-bold'
                        onClick={() => setIsOpen(false)}
                    />
                    <PrimaryButton
                        text='Go to Login'
                        className='!border-2 border-white !font-bold'
                        onClick={handleLogin}
                        center={false}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AuthorizationModal;