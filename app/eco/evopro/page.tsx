import {Metadata} from 'next';
import EvoProClient from './EvoProClient';
import {getEvoProPublicState} from '@/lib/evopro-public';
import {EVOPRO_CONFIG} from '@/data/evopro';

export const metadata:Metadata={
  title:'EvoPro — Evolution Protocol | AG47',
  description:'Protocolo operacional cognitivo, repository-native, para evolução governada de software assistido por agentes de IA.',
  alternates:{canonical:'/eco/evopro'},
  openGraph:{title:'EvoPro — Evolution Protocol | AG47',description:'Understand before changing. Prove before remembering. Measure before claiming improvement.',url:'https://ag47.pt/eco/evopro',siteName:'Agência 47 — ECO',locale:'pt_PT',type:'website',images:[{url:'https://ag47.pt/opengraph-image.png',width:1200,height:630,alt:'EvoPro — Evolution Protocol | AG47 ECO'}]},
  twitter:{card:'summary_large_image',title:'EvoPro — Evolution Protocol | AG47',description:'Cognitive operating protocol for governed software evolution. Repository-native, memory-aware and evidence-driven.'},
  keywords:['EvoPro','Evolution Protocol','AG47','cognitive software architecture','coding agents governance','repository native','harness agnostic','AI software engineering','Context Router','Agent Governance','Code Graph','Gauntlet adversarial review']
};

export default async function EvoProPage(){
  const publicState=await getEvoProPublicState();
  const manifest=publicState?.manifest;
  const version=manifest?.version||EVOPRO_CONFIG.version;
  const canonical=manifest?.canonical_url||EVOPRO_CONFIG.canonicalUrl;
  const repository=manifest?.repository||EVOPRO_CONFIG.gitHubUrl;
  const jsonLd={'@context':'https://schema.org','@graph':[
    {'@type':'SoftwareApplication',name:'EvoPro — Evolution Protocol',applicationCategory:'DeveloperApplication',operatingSystem:'Cross-platform',softwareVersion:version,description:'Repository-native cognitive operating protocol for governed software evolution assisted by AI coding agents.',url:canonical,author:{'@type':'Organization',name:'Agência 47 Labs',url:'https://ag47.pt'},license:'https://opensource.org/licenses/MIT'},
    {'@type':'SoftwareSourceCode',name:'ag47-evolution-protocol',codeRepository:repository,programmingLanguage:'Python',runtimePlatform:'Python >=3.10',version,license:'https://opensource.org/licenses/MIT'},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'AG47',item:'https://ag47.pt'},{'@type':'ListItem',position:2,name:'ECO',item:'https://ag47.pt/eco/evopro'},{'@type':'ListItem',position:3,name:'EvoPro',item:'https://ag47.pt/eco/evopro'}]}
  ]};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><EvoProClient publicState={publicState}/></>;
}
