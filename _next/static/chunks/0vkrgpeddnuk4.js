(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,73831,e=>{"use strict";var t=e.i(17247),a=e.i(68482),s=e.i(46411),r=e.i(57770),n=e.i(61857),i=e.i(77003),o=e.i(92943),l=e.i(72166),d=e.i(60840);let c=(0,e.i(47944).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);var _=e.i(94306),m=e.i(57939),h=e.i(51707),p=e.i(9655),u=e.i(20888);let x=[{id:1,title:"I Have an Idea",useWhen:"You have a concept and nothing exists yet",level:"beginner",template:`I want to build ___[product]___.

CHARACTERS:
• Who it's for: ___[describe your user]___
• Their biggest frustration: ___[pain point]___

OBJECTIVE:
• The ONE thing it must do: ___[core action]___

NO-GOS:
• It should NEVER: ___[things you don't want]___

TONE:
• It should feel like ___[name a real app]___

EXAMPLES:
• Visual style like: ___[app name or URL]___

TEST:
• I'll know it works when I can: ___[specific action]___`},{id:2,title:"Make It Look Like This",useWhen:"You can point to an existing app as inspiration",level:"beginner",template:`I want something that looks and feels like ___[existing app]___, but instead of ___[what that app does]___, it does ___[what your product does]___.

KEEP the same:
• Visual style (colors, spacing, typography)
• Navigation pattern

CHANGE the content to be about ___[your topic/purpose]___.`},{id:3,title:"This Is Broken",useWhen:"Something doesn't work the way you expect",level:"intermediate",template:`Something's not working right.

WHAT I DID:
1. I go to ___[page/section]___
2. I click/tap on ___[element]___
3. I see ___[what actually happens]___

WHAT I EXPECTED:
___[what should have happened instead]___

Fix the root cause, not just the symptom.`},{id:4,title:"Add This Feature",useWhen:"The app works but you want it to do more",level:"intermediate",template:`My app currently lets you ___[what it does now]___.

I want to add ___[new feature in plain language]___.

HOW IT SHOULD WORK:
• When the user ___[does something]___, then ___[this should happen]___

CONSTRAINTS:
• It must fit naturally with what's already there
• Don't break anything that currently works`},{id:5,title:"Make It Better",useWhen:"The app works but feels rough or unfinished",level:"intermediate",template:`My app works, but it doesn't feel finished. Make it better:

→ Make it look more polished and professional
→ Make it feel smoother to use
→ Add anything that's obviously missing
→ Fix anything that looks off or feels clunky

Take it from "prototype" to "something I'd actually show people."`},{id:6,title:"The Full Spec",useWhen:"You want maximum control and precision",level:"advanced",template:`## PRODUCT SPEC

### Product
___[Name]___ — ___[One-line description]___

### User
___[Who this is for — be specific about a real person]___

### Must Have
- ___[Feature 1]___
- ___[Feature 2]___

### Must NOT Have
- ___[Thing you explicitly don't want]___

### Done Criteria
- ___[Testable outcome 1]___
- ___[Testable outcome 2]___`},{id:7,title:"The Iteration Loop",useWhen:"You want the AI to keep improving autonomously",level:"advanced",template:`Check on my app and make it better every time:

1. ASSESS: Open it and test that everything works
2. FIX FIRST: If something's broken, fix it
3. IMPROVE: If everything works, make one improvement
4. VERIFY: Test that your change didn't break anything

RULES:
• Never break what's working
• Always leave it better than you found it`},{id:8,title:"The Business Builder",useWhen:"You have a real business need",level:"advanced",template:`## BUSINESS CONTEXT
I run a ___[type of business]___ with ___[number]___ customers.

## THE TOOL I NEED
A tool that helps me ___[the business problem you're solving]___.

## MY CUSTOMERS
___[Describe them]___

## WHAT IT MUST DO
1. ___[Core action]___

## TONE
Trustworthy and professional. Think ___[professional app name]___.`}],b={beginner:"bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",intermediate:"bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",advanced:"bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800"};e.s(["default",0,function(){let[e,g]=(0,a.useState)(null),[y,v]=(0,a.useState)(null),[k,w]=(0,a.useState)(""),[f,j]=(0,a.useState)("all"),N=function(e,t=300){let[s,r]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let a=setTimeout(()=>{r(e)},t);return()=>{clearTimeout(a)}},[e,t]),s}(k,300),T=x.filter(e=>{let t=""===N||e.title.toLowerCase().includes(N.toLowerCase())||e.useWhen.toLowerCase().includes(N.toLowerCase()),a="all"===f||e.level===f;return t&&a}),I=(0,a.useCallback)(async(e,t)=>{await (0,h.copyToClipboard)(t)?(v(e),_.toast.success("Template copied!"),setTimeout(()=>v(null),2e3)):_.toast.error("Failed to copy")},[]),E=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let e=e=>{(e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),E.current?.focus())};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[]),(0,t.jsxs)("section",{id:"templates",className:"py-20 sm:py-32 relative",suppressHydrationWarning:!0,children:[(0,t.jsx)("div",{className:"absolute right-0 top-1/4 bottom-1/4 w-1/5 bg-stone-100/30 dark:bg-stone-800/10 -skew-x-12 hidden lg:block"}),(0,t.jsxs)("div",{className:"relative max-w-7xl mx-auto px-6 sm:px-8",children:[(0,t.jsxs)(s.motion.div,{initial:{opacity:0,x:-30},whileInView:{opacity:1,x:0},viewport:{once:!0},transition:{duration:.8,ease:[.16,1,.3,1]},className:"mb-16 max-w-2xl",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-6",children:[(0,t.jsx)("div",{className:"h-px w-8 bg-primary/40"}),(0,t.jsx)("span",{className:"text-xs font-medium tracking-[0.2em] uppercase text-primary/50 font-display",children:"Part 3"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,t.jsxs)("h2",{className:"font-display-xl text-stone-900 dark:text-stone-100",children:["Template ",(0,t.jsx)("span",{className:"italic font-[550] text-primary/70",children:"Library"})]}),(0,t.jsx)(u.default,{sectionId:"templates"})]}),(0,t.jsx)("p",{className:"text-lg text-stone-600 dark:text-stone-400 leading-relaxed",children:"Copy, fill in, send. Every situation covered."}),(0,t.jsx)("div",{className:"flex items-center gap-6 mt-8",children:[{level:"beginner",label:"Beginner",count:2},{level:"intermediate",label:"Intermediate",count:3},{level:"advanced",label:"Advanced",count:3}].map((e,a)=>(0,t.jsxs)(s.motion.div,{initial:{opacity:0,y:10},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:.2+.1*a},className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"text-xs text-stone-400 uppercase tracking-wider",children:e.label}),(0,t.jsx)("div",{className:"h-0.5 flex-1 w-8 bg-stone-200 dark:bg-stone-800 rounded-full",children:(0,t.jsx)("div",{className:"h-full bg-primary rounded-full",style:{width:`${e.count/8*100}%`}})})]},e.level))}),(0,t.jsxs)("div",{className:"mt-8 flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"relative flex-1 max-w-md",children:[(0,t.jsx)(c,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"}),(0,t.jsx)(p.Input,{ref:E,type:"text",placeholder:"Search templates...",value:k,onChange:e=>w(e.target.value),className:"pl-10 pr-20 rounded-xl border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"}),(0,t.jsx)("kbd",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded hidden sm:inline-block",children:"⌘K"})]}),(0,t.jsx)("div",{className:"flex gap-2",children:["all","beginner","intermediate","advanced"].map(e=>(0,t.jsx)("button",{onClick:()=>j(e),className:(0,m.cn)("px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",f===e?"bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900 dark:border-white":"bg-white text-stone-600 border-stone-200 hover:border-amber-400 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800"),children:"all"===e?"All":e.charAt(0).toUpperCase()+e.slice(1)},e))})]})]}),N&&(0,t.jsxs)("p",{className:"text-sm text-stone-500 dark:text-stone-400 mb-4",children:[T.length," template",1!==T.length?"s":""," found"]}),(0,t.jsx)("div",{className:"space-y-4",children:T.map((a,c)=>{let _=e===a.id;return(0,t.jsx)(s.motion.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-20px"},transition:{duration:.5,delay:.05*c},children:(0,t.jsxs)("div",{className:(0,m.cn)("group border-b border-stone-200/60 dark:border-stone-800/60 transition-all duration-300",_&&"bg-stone-50 dark:bg-stone-900/30 -mx-4 px-4"),children:[(0,t.jsxs)("button",{onClick:()=>g(_?null:a.id),className:"w-full py-4 flex items-start gap-4 text-left",children:[(0,t.jsx)("div",{className:"shrink-0 mt-1",children:(0,t.jsx)("div",{className:(0,m.cn)("w-8 h-8 flex items-center justify-center text-sm font-display font-[600] transition-colors duration-300",_?"text-primary":"text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300"),children:a.id})}),(0,t.jsx)("div",{className:"flex-1 min-w-0",children:(0,t.jsxs)("div",{className:"flex items-start justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("h3",{className:(0,m.cn)("font-display text-base transition-colors duration-300",_?"text-stone-900 dark:text-stone-100":"text-stone-600 dark:text-stone-400"),children:a.title}),(0,t.jsx)("span",{className:(0,m.cn)("px-2 py-0.5 rounded-full text-xs font-medium border",b[a.level]),children:a.level})]}),(0,t.jsx)("p",{className:"text-xs text-stone-400 dark:text-stone-500 mt-0.5",children:a.useWhen})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 shrink-0",children:[(0,t.jsx)("span",{className:(0,m.cn)("text-[10px] px-2 py-0.5 uppercase tracking-wider border transition-colors","beginner"===a.level&&"text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50","intermediate"===a.level&&"text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50","advanced"===a.level&&"text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"),children:a.level}),(0,t.jsx)(s.motion.div,{animate:{rotate:180*!!_},transition:{duration:.3},children:(0,t.jsx)(d.ChevronDown,{className:"w-4 h-4 text-stone-400"})})]})]})})]}),(0,t.jsx)(r.AnimatePresence,{children:_&&(0,t.jsx)(s.motion.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.4,ease:[.16,1,.3,1]},className:"overflow-hidden",children:(0,t.jsx)("div",{className:"pb-6 pl-12",children:(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)("pre",{className:"text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-mono bg-stone-50 dark:bg-stone-900/50 p-6 border border-stone-200/60 dark:border-stone-800/60 overflow-x-auto",children:a.template.split(/(___\[.*?\]___)/g).map((e,a)=>{let s=e.match(/^___\[(.*?)\]___$/);return s?(0,t.jsx)("mark",{className:"bg-primary/10 text-primary px-1 rounded",children:s[1]},a):(0,t.jsx)("span",{children:e},a)})}),(0,t.jsx)(n.Button,{variant:"outline",size:"sm",className:"mt-3 group border-stone-300 dark:border-stone-700 hover:border-primary/50 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-all duration-300",onClick:e=>{e.stopPropagation(),I(a.id,a.template)},children:y===a.id?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Check,{className:"w-3.5 h-3.5 mr-1.5 text-emerald-500"}),"Copied"]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Copy,{className:"w-3.5 h-3.5 mr-1.5"}),"Copy",(0,t.jsx)(l.ArrowRight,{className:"w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"})]})})]})})})})]})},a.id)})})]})]})}],73831)}]);