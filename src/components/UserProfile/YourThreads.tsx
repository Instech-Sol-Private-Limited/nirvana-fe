'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { FaRegSadTear, FaArrowLeft } from 'react-icons/fa';
import ProfileThreadItem from './ProfileThread';
import { Thread } from '@/types';
import { getThreadsByUserId } from '@/utils/threads';
import { useRouter } from 'next/navigation';

export default function YourThreads() {
    const { userData, loading } = useAuth();
    const [userThreads, setUserThreads] = useState<Thread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshThreads = async () => {
        if (!userData) return;

        setIsLoading(true);
        try {
            const userId = userData?.id;
            if (userId) {
                const response = await getThreadsByUserId(userId, 20, 0);

                if (response.success && response.data) {
                    setUserThreads(response.data.threads);
                } else {
                    console.error('Error fetching threads:', response.message);
                    setUserThreads([]);
                }
            }
        } catch (error) {
            console.error('Error fetching user threads:', error);
            setUserThreads([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            refreshThreads();
        }
    }, [userData]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center py-20">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-4/5 mx-auto px-4 sm:px-0 py-6">
            <button
                onClick={() => router.back()}
                className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition flex items-center gap-2"
            >
                <FaArrowLeft className="mr-2" />
                Back
            </button>
            <h1 className="text-2xl font-bold text-white mb-6">Your Posted Threads</h1>

            <div className="space-y-4">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                            </div>
                        ))}
                    </>
                ) : userThreads.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                        <div className="bg-gray-700 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
                            <FaRegSadTear className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">No Threads Found</h2>
                        <p className="text-gray-400 mb-4">You haven't posted any threads yet.</p>
                    </div>
                ) : (
                    userThreads.map((thread) => (
                        <ProfileThreadItem
                            key={thread.id}
                            thread={thread}
                            isCurrentUser={true}
                            onThreadUpdated={refreshThreads}
                        />
                    ))
                )}
            </div>
        </div>
    );
}