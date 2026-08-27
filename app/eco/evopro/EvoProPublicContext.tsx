'use client';

import React,{createContext,useContext} from 'react';
import type {EvoProPublicState} from '@/lib/evopro-public';

const EvoProPublicContext=createContext<EvoProPublicState|null>(null);

export function EvoProPublicProvider({state,children}:{state:EvoProPublicState|null;children:React.ReactNode}){
  return <EvoProPublicContext.Provider value={state}>{children}</EvoProPublicContext.Provider>;
}

export function useEvoProPublic(){return useContext(EvoProPublicContext);}
