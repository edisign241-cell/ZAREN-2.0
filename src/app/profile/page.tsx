'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.replace(`/profile/${currentUser.id}`);
    } else {
      router.replace('/');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008A45]" />
    </div>
  );
}
