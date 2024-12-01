
export type AccordionItem ={
  x:number|null;
  id:number;
  question:string;
  answer:string;
  openAccordianFunction:(x:number|null)=>void
}

export type AccordianDataType = {
  id:number;
  question:string;
  answer:string;
}

