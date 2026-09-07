import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SwapProof from './swap-proof';
import ErdosProof from './erdos-proof';
import ProofFilm from './proof-film';
export default function Home(){
  const [tab,setTab]=useState('film');
  return <main><Tabs className="proof-tabs" value={tab} onValueChange={value=>setTab(String(value))}>
    <TabsList className="proof-tab-list" aria-label="Choose a proof"><TabsTrigger value="swap">Swap two facts</TabsTrigger><TabsTrigger value="erdos728">Erdős #728</TabsTrigger><TabsTrigger value="film">Watch proof</TabsTrigger></TabsList>
    <TabsContent value="swap" keepMounted><SwapProof active={tab==='swap'}/></TabsContent>
    <TabsContent value="erdos728" keepMounted><ErdosProof active={tab==='erdos728'}/></TabsContent>
    <TabsContent value="film" keepMounted><ProofFilm active={tab==='film'}/></TabsContent>
  </Tabs></main>;
}
