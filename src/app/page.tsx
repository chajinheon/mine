'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = getFirebaseAuth();

    // Check if user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard/overview');
      } else {
        // No user, sign in anonymously
        signInAnonymously(auth)
          .then(() => {
            router.push('/dashboard/overview');
          })
          .catch((err) => {
            setError('인증 실패: ' + err.message);
            setIsLoading(false);
          });
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading || !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">출석 통계 대시보드</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => location.reload()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
