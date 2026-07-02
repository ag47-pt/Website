"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import OracleLogin from './oracle-login';
import OracleTraderPanel from './oracle-trader-panel';
import { Loader2 } from 'lucide-react';

export default function OracleAuthWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center relative z-10">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <OracleLogin />;
  }

  return <OracleTraderPanel />;
}
