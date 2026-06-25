'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function RegPage() {
  const router = useRouter();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) localStorage.setItem('invitationCode', code);
    router.replace('/signin');
  }, [router]);
  return null;
}
