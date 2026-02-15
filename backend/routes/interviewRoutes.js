const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");

// 🔹 30 Real HTML Questions
const htmlQuestions = [
  { q: "What is HTML?", keywords:["markup","hypertext","structure","web","elements"] },
  { q: "What is the difference between HTML and XHTML?", keywords:["strict","xml","doctype","syntax"] },
  { q: "What is semantic HTML?", keywords:["semantic","meaningful","elements","accessibility"] },
  { q: "What are block-level and inline elements?", keywords:["block","inline","layout","elements"] },
  { q: "What are HTML attributes?", keywords:["attributes","properties","elements","values"] },
  { q: "Explain the <div> and <span> tags.", keywords:["div","span","containers","inline","block"] },
  { q: "What is the difference between <head> and <body>?", keywords:["head","body","metadata","content"] },
  { q: "What is the purpose of <meta> tags?", keywords:["meta","metadata","charset","viewport"] },
  { q: "Explain the difference between <ul>, <ol>, and <li>.", keywords:["ul","ol","li","lists","ordered","unordered"] },
  { q: "What is the <a> tag used for?", keywords:["anchor","link","href","navigation"] },
  { q: "Explain the <form> tag and its attributes.", keywords:["form","input","action","method"] },
  { q: "What are HTML5 semantic tags?", keywords:["header","footer","section","article","nav"] },
  { q: "What is the difference between <strong> and <b>?", keywords:["strong","bold","emphasis","text"] },
  { q: "What is the difference between <em> and <i>?", keywords:["emphasis","italic","text","meaning"] },
  { q: "What is the <canvas> element?", keywords:["canvas","drawing","graphics","HTML5"] },
  { q: "What is the <audio> and <video> element?", keywords:["audio","video","media","HTML5"] },
  { q: "Explain the difference between <section> and <div>.", keywords:["section","div","semantic","structure"] },
  { q: "What is the <iframe> tag?", keywords:["iframe","embed","frame","content"] },
  { q: "What are data-* attributes?", keywords:["data","custom","attributes","HTML5"] },
  { q: "What is the difference between <script> and external JS?", keywords:["script","external","javascript","src"] },
  { q: "What is the difference between <link> and <style>?", keywords:["link","style","CSS","external","internal"] },
  { q: "What is the <noscript> tag?", keywords:["noscript","javascript","fallback"] },
  { q: "Explain the difference between <input type='text'> and <textarea>.", keywords:["input","textarea","form","text"] },
  { q: "What is the difference between <label> and placeholder?", keywords:["label","placeholder","form","UX"] },
  { q: "What is the <figure> and <figcaption> tag?", keywords:["figure","figcaption","image","caption","HTML5"] },
  { q: "What are HTML entities?", keywords:["entities","characters","symbols","special"] },
  { q: "Explain the <details> and <summary> tags.", keywords:["details","summary","HTML5","toggle"] },
  { q: "What is the <mark> tag used for?", keywords:["mark","highlight","text","HTML5"] },
  { q: "What is the difference between <del> and <s>?", keywords:["del","s","strikethrough","text"] },
  { q: "What is the difference between <abbr> and <acronym>?", keywords:["abbr","acronym","HTML","shortcuts"] },
  { q: "Explain the <progress> and <meter> tags.", keywords:["progress","meter","HTML5","values"]}
];

// 🔹 30 Real CSS Questions
const cssQuestions = [
  { q: "What is CSS?", keywords:["cascading","stylesheet","style","web"] },
  { q: "What are the different types of CSS?", keywords:["inline","internal","external","style"] },
  { q: "What is the difference between relative, absolute, fixed, and sticky position?", keywords:["position","relative","absolute","fixed","sticky"] },
  { q: "What is the difference between inline, block, and inline-block?", keywords:["display","block","inline","inline-block"] },
  { q: "What is the difference between id and class selectors?", keywords:["id","class","selectors","css"] },
  { q: "What are pseudo-classes in CSS?", keywords:["hover","active","focus","pseudo"] },
  { q: "What are pseudo-elements?", keywords:["before","after","first-letter","pseudo"] },
  { q: "What is the difference between em, rem, px, %, and vw units?", keywords:["units","em","rem","px","percentage","viewport"] },
  { q: "What is the difference between relative and absolute units?", keywords:["units","relative","absolute","css"] },
  { q: "What is the difference between inline, internal, and external CSS?", keywords:["inline","internal","external","stylesheet"] },
  { q: "What is specificity in CSS?", keywords:["specificity","priority","selectors","rules"] },
  { q: "What are media queries?", keywords:["media","queries","responsive","css"] },
  { q: "What is the difference between visibility: hidden and display: none?", keywords:["visibility","display","hidden","none"] },
  { q: "Explain the difference between position static and relative.", keywords:["position","static","relative","css"] },
  { q: "What is the difference between float and clear?", keywords:["float","clear","layout","css"] },
  { q: "What is z-index?", keywords:["z-index","stack","layer","css"] },
  { q: "What is flexbox?", keywords:["flex","flexbox","container","items"] },
  { q: "What are the main properties of flexbox?", keywords:["justify-content","align-items","flex-direction","flex-wrap"] },
  { q: "What is grid layout?", keywords:["grid","rows","columns","css"] },
  { q: "What are CSS transitions?", keywords:["transitions","animation","smooth","css"] },
  { q: "What are CSS animations?", keywords:["animation","keyframes","css"] },
  { q: "What is the difference between relative, absolute, and fixed units in positioning?", keywords:["position","relative","absolute","fixed"] },
  { q: "What is the difference between inline styles and !important?", keywords:["inline","important","css"] },
  { q: "What is the difference between CSS variables and regular properties?", keywords:["variables","custom","css"] },
  { q: "What is box-sizing in CSS?", keywords:["box-sizing","border","padding","width"] },
  { q: "What are pseudo-selectors like :nth-child?", keywords:["pseudo","nth-child","selectors"] },
  { q: "Explain the difference between overflow: hidden, scroll, and auto.", keywords:["overflow","hidden","scroll","auto"] },
  { q: "What are CSS sprites?", keywords:["sprites","images","css","optimization"] },
  { q: "What is the difference between relative and absolute positioning in flexbox?", keywords:["flexbox","position","relative","absolute"] },
  { q: "What is the difference between em and rem units?", keywords:["em","rem","units","css"]}
];

// 🔹 30 Real Node.js Questions
const nodeQuestions = [
  { q: "What is Node.js?", keywords:["javascript","runtime","server","event"] },
  { q: "What are the features of Node.js?", keywords:["asynchronous","event-driven","non-blocking","single-threaded"] },
  { q: "Explain the event loop in Node.js.", keywords:["event","loop","asynchronous","callbacks"] },
  { q: "What is npm?", keywords:["npm","package","manager","modules"] },
  { q: "What is the difference between require() and import?", keywords:["require","import","modules","commonjs","esm"] },
  { q: "What is package.json?", keywords:["package.json","dependencies","scripts","metadata"] },
  { q: "Explain callback functions.", keywords:["callback","function","asynchronous"] },
  { q: "What is the difference between synchronous and asynchronous?", keywords:["sync","async","blocking","non-blocking"] },
  { q: "What are streams in Node.js?", keywords:["streams","readable","writable","data"] },
  { q: "What is the difference between process.nextTick() and setImmediate()?", keywords:["process","nextTick","setImmediate","event loop"] },
  { q: "What are buffers in Node.js?", keywords:["buffer","binary","data"] },
  { q: "What is the difference between __dirname and __filename?", keywords:["dirname","filename","path"] },
  { q: "What is Express.js?", keywords:["express","framework","node","routes"] },
  { q: "How do you create a server using Express?", keywords:["express","server","listen","routes"] },
  { q: "What is middleware in Express?", keywords:["middleware","function","request","response"] },
  { q: "What are routes in Express?", keywords:["routes","express","url","endpoints"] },
  { q: "What is the difference between app.use() and app.get()?", keywords:["use","get","express","routes"] },
  { q: "What is the purpose of next() in middleware?", keywords:["next","middleware","express"] },
  { q: "What is REST API?", keywords:["rest","api","http","routes"] },
  { q: "What are HTTP methods used in Node.js?", keywords:["get","post","put","delete","methods"] },
  { q: "What is the difference between PUT and PATCH?", keywords:["put","patch","http","update"] },
  { q: "What is CORS?", keywords:["cors","security","cross-origin"] },
  { q: "How do you handle errors in Express?", keywords:["error","middleware","express"] },
  { q: "What are modules in Node.js?", keywords:["modules","require","export"] },
  { q: "What is cluster module?", keywords:["cluster","multi-core","node"] },
  { q: "What are environment variables?", keywords:["env","process","variables"] },
  { q: "What is the difference between spawn and fork?", keywords:["spawn","fork","child process"] },
  { q: "How do you read files asynchronously?", keywords:["fs","readFile","async","node"] },
  { q: "How do you write files asynchronously?", keywords:["fs","writeFile","async","node"] }
];

// 🔹 Skill mapping
const skillQuestions = { HTML: htmlQuestions, CSS: cssQuestions, "Node.js": nodeQuestions };

// 🔹 Track current index per skill
const skillIndex = { HTML:0, CSS:0, "Node.js":0 };

// 🔹 Get question for skill
router.get("/question/:skill",(req,res)=>{
  const skill = req.params.skill;
  if(!skillQuestions[skill]) return res.status(400).json({error:"Skill not found"});
  if(skillIndex[skill]>=skillQuestions[skill].length) skillIndex[skill]=0;

  res.json({question: skillQuestions[skill][skillIndex[skill]].q});
});

// 🔹 Submit answer
router.post("/answer/:skill", async (req,res)=>{
  const skill = req.params.skill;
  const answerText = req.body.answer.toLowerCase();
  if(!skillQuestions[skill]) return res.status(400).json({error:"Skill not found"});

  const currentQ = skillQuestions[skill][skillIndex[skill]];
  let score=0;
  currentQ.keywords.forEach(k=>{
    if(answerText.includes(k)) score+=2;
  });

  const feedback = score>=6?"Excellent":score>=4?"Good":"Needs Improvement";

  await Answer.create({
    skill,
    question: currentQ.q,
    answer: answerText,
    score
  });

  skillIndex[skill]++; // move to next
  res.json({score, feedback});
});

// 🔹 View history
router.get("/history", async (req,res)=>{
  const data = await Answer.find().sort({date:-1});
  res.json(data);
});
// 🔹 VIEW ALL ANSWER HISTORY
router.get("/history", async (req, res) => {
  try {
    const history = await Answer.find().sort({ date: -1 }); // newest first
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 🔹 Clear All Answer History
router.delete("/history", async (req, res) => {
  try {
    await Answer.deleteMany({});
    res.json({ message: "All history cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});



module.exports = router;
