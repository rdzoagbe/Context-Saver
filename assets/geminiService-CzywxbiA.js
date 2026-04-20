import{G as a}from"./index-otSsRz90.js";let r=null;const c=()=>{if(r)return r;let e;return(!e||e==="undefined")&&(e=void 0),(!e||e==="undefined")&&typeof window<"u"&&(e=localStorage.getItem("GEMINI_API_KEY_OVERRIDE")||void 0),!e||e==="undefined"||e.trim()===""?null:(r=new a({apiKey:e.trim()}),r)},n=()=>{const e=c();if(!e)throw new Error("GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your hosting environment or provide an override in settings.");return e},u={async summarizeMeeting(e){if(!e.trim())return"No conversation detected.";try{return(await n().models.generateContent({model:"gemini-3-flash-preview",contents:`You are an expert executive assistant. Summarize the following meeting transcript into a concise format:
        1. **Key Decisions**
        2. **Action Items** (with owners if mentioned)
        3. **Important Mentions**
        
        Transcript:
        ${e}`})).text||"No summary generated."}catch(t){throw console.error("Gemini summarization error:",t),t}},async extractImportantTopics(e){try{const s=(await n().models.generateContent({model:"gemini-3-flash-preview",contents:`Extract the top 5 important topics or keywords from this conversation as a comma-separated list:
        ${e}`})).text;return(s==null?void 0:s.split(",").map(i=>i.trim()))||[]}catch(t){return console.error("Gemini topic extraction error:",t),[]}},async generateResumeStrategy(e){try{return(await n().models.generateContent({model:"gemini-3-flash-preview",contents:`You are a productivity expert. Given this session context, provide a "Smart Resume Strategy" to help the user get back into deep flow:
        
        Session: ${e.title}
        Current Task: ${e.currentTask}
        Next Step: ${e.nextStep}
        Notes: ${e.notes}
        
        Give 3 punchy points to resume.`})).text||"Focus on the next task."}catch(t){return console.error("Resume strategy error:",t),"Flow strategy not available right now. Just focus on the next step!"}},async generateLinkSummary(e){try{return(await n().models.generateContent({model:"gemini-3-flash-preview",contents:`Briefly summarize the context of these URLs for a productivity session: ${e.join(", ")}`})).text||"No summary available."}catch(t){return console.error("Link summary error:",t),"Contextual summary not available."}}};export{u as g};
