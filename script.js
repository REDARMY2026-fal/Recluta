const defaultState={xp:0,level:1,completed:0,skills:{Disciplina:1,Resistencia:1,Inteligencia:1,Coordinación:1,Liderazgo:1},history:[],team:[],teamConfirmed:false,campaignMonth:0,campaignLog:[],operations:[],operationProgress:null};
let state;
try{
 state={...defaultState,...JSON.parse(localStorage.getItem("recluta-save")||"{}")};
 state.skills={...defaultState.skills,...(state.skills||{})};
 state.history=Array.isArray(state.history)?state.history:[];
 state.team=Array.isArray(state.team)?state.team:[];
 state.campaignMonth=Number.isInteger(state.campaignMonth)&&state.campaignMonth>=0?state.campaignMonth:0;
 state.campaignLog=Array.isArray(state.campaignLog)?state.campaignLog:[];
 state.operations=Array.isArray(state.operations)?state.operations:[];
 const p=state.operationProgress;
 if(p&&p.mission==="first-destination"&&p.stage==="allocation"&&p.allocations&&typeof p.allocations==="object"){
  const clean={};for(const place of ["norte","sur","escuela"]){clean[place]={};for(const item of ["agua","alimentos","medicina"]){const v=p.allocations[place]?.[item];clean[place][item]=Number.isInteger(v)&&v>=0&&v<=8?v:0;}}
  state.operationProgress={mission:"first-destination",stage:"allocation",allocations:clean,attempts:Number.isInteger(p.attempts)&&p.attempts>=0?p.attempts:0};
 }else if(p&&Number.isInteger(p.step)&&p.step>=0&&p.step<=2){
  state.operationProgress={mission:"first-destination",stage:"allocation",allocations:{norte:{agua:0,alimentos:0,medicina:0},sur:{agua:0,alimentos:0,medicina:0},escuela:{agua:0,alimentos:0,medicina:0}},attempts:0};
 }else state.operationProgress=null;
}catch{state={...defaultState};}

const ranks=["Recluta","Soldado","Cabo","Sargento","Teniente","Capitán","Mayor","Coronel","General"];
const candidates=[
{id:"martin",name:"Martín Sosa",age:21,role:"Logística",trait:"Organizado · responsable · detallista",strength:"Planificación y control de suministros",weakness:"A veces piensa demasiado antes de actuar.",skill:"PLAN B",bio:"Ayudaba en el negocio familiar y aprendió a resolver problemas con recursos limitados.",quote:"«Si tenemos un plan, también tenemos que tener una alternativa.»",bonus:"Mejor criterio en desafíos de organización."},
{id:"tomas",name:"Tomás Ferreyra",age:20,role:"Comunicaciones",trait:"Creativo · curioso · bromista",strength:"Tecnología e interpretación de información",weakness:"Puede distraerse cuando algo le interesa demasiado.",skill:"SEÑAL CLARA",bio:"Siempre tuvo curiosidad por la tecnología y disfruta encontrar soluciones poco convencionales.",quote:"«Pará, creo que encontré una forma más sencilla.»",bonus:"Aporta una mirada creativa a los problemas."},
{id:"valentina",name:"Valentina Ríos",age:22,role:"Coordinación",trait:"Empática · decidida · observadora",strength:"Trabajo en equipo y organización de personas",weakness:"A veces asume demasiadas responsabilidades.",skill:"TRABAJO EN EQUIPO",bio:"Participó en proyectos comunitarios y aprendió a escuchar y coordinar grupos.",quote:"«Primero escuchemos a todos. Después decidimos.»",bonus:"Ayuda a equilibrar decisiones grupales."},
{id:"lucas",name:"Lucas Benítez",age:21,role:"Análisis",trait:"Paciente · analítico · reservado",strength:"Detectar patrones y evaluar información",weakness:"Le cuesta decidir cuando faltan datos.",skill:"LECTURA DE DATOS",bio:"Se destacó en competencias académicas y disfruta resolver enigmas y ordenar información.",quote:"«Hay un detalle que todavía no estamos viendo.»",bonus:"Útil en pruebas de lógica y análisis."},
{id:"camila",name:"Camila Torres",age:20,role:"Asistencia y personal",trait:"Práctica · sociable · perseverante",strength:"Administrar tiempos y distribuir tareas",weakness:"Puede frustrarse cuando el grupo no se organiza.",skill:"ORDEN DE EQUIPO",bio:"Organizaba actividades de voluntariado y sabe adaptar los planes cuando cambian las necesidades.",quote:"«Cada persona puede aportar algo. Organicemos las tareas.»",bonus:"Útil en coordinación y decisiones de equipo."}
];
const $=id=>document.getElementById(id);
function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
function save(){try{localStorage.setItem("recluta-save",JSON.stringify(state))}catch(error){console.warn("No se pudo guardar el progreso en este navegador.",error)}render()}
function campaignDate(){const date=new Date(2026,state.campaignMonth,1);const label=date.toLocaleDateString("es-AR",{month:"long",year:"numeric"});return label.charAt(0).toUpperCase()+label.slice(1)}
function advanceMonth(){state.campaignMonth++;const date=campaignDate();state.campaignLog.push(date);save();$("campaign-date").textContent=date.toUpperCase();const notice=$("campaign-notice");if(notice)notice.textContent="El calendario avanzó. Nuevo período: "+date+". Tu progreso y tu equipo se mantienen."}
function xpNeeded(){return state.level*100}
function rank(){return ranks[Math.min(Math.floor((state.level-1)/2),ranks.length-1)]}
function render(){
 $("campaign-date").textContent=campaignDate().toUpperCase();
 $("lobby-level").textContent=String(state.level).padStart(2,"0");$("lobby-xp").textContent=state.xp;$("lobby-completed").textContent=state.completed;
 $("rank").textContent=rank().toUpperCase();$("profile-rank").textContent=rank();$("level").textContent=String(state.level).padStart(2,"0");$("xp").textContent=state.xp;$("completed").textContent=state.completed;$("xp-next").textContent=`${state.xp} / ${xpNeeded()} XP para el próximo nivel`;$("xp-progress-label").textContent=`${state.xp} / ${xpNeeded()} XP`;$("xp-progress-bar").style.width=`${Math.min(100,state.xp/xpNeeded()*100)}%`;
 $("skills").innerHTML=Object.entries(state.skills).map(([name,value])=>`<div><div class="skill-head"><span>${name.toUpperCase()}</span><b>NIV. ${value}</b></div><div class="bar"><span style="width:${Math.min(value*10,100)}%"></span></div></div>`).join("");
 $("history-list").innerHTML=state.history.length?state.history.slice().reverse().map(x=>`<p>▸ ${x.name} — +${x.xp} XP <span class="muted">· ${x.date}</span></p>`).join(""):"Todavía no completaste ninguna prueba.";
 $("squad-summary").textContent=state.teamConfirmed?state.team.map(id=>candidates.find(c=>c.id===id)?.name).filter(Boolean).join(" · "):"Todavía no seleccionaste a tus compañeros.";
 renderTeam();
}
function candidatePortrait(c){
 const palette={martin:["#607b68","#d2a47c","#27362b"],tomas:["#657d9d","#d5a783","#29364b"],valentina:["#9b746e","#e0b18e","#493039"],lucas:["#817a9b","#c99776","#343044"],camila:["#9a825e","#d9a17e","#3e3328"]}[c.id]||["#71836c","#d2a47c","#29362b"];
 const [bg,skin,hair]=palette;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="${bg}"/><path d="M18 160c5-34 26-50 62-50s57 16 62 50" fill="#17221a"/><path d="M48 76c0-31 14-48 33-48s34 17 34 48v17c0 20-15 36-34 36S48 113 48 93z" fill="${skin}"/><path d="M46 75c-3-34 13-55 37-55 26 0 42 19 37 57l-9-18c-14 2-31-4-42-15-4 14-12 22-23 31z" fill="${hair}"/><path d="M62 82h9m19 0h9" stroke="#382c27" stroke-width="4" stroke-linecap="round"/><path d="M73 103q9 7 18 0" fill="none" stroke="#8b5548" stroke-width="3" stroke-linecap="round"/><path d="M54 143l26-18 26 18" fill="none" stroke="#a6b47a" stroke-width="5"/><path d="M0 145h160" stroke="#ffffff" stroke-opacity=".18"/></svg>`;
 return `<img class="candidate-portrait" src="data:image/svg+xml,${encodeURIComponent(svg)}" alt="Retrato ilustrado de ${c.name}" loading="lazy" decoding="async">`;
}
function renderTeam(){
 $("team-count").textContent=`${selectedTeam.length} / 3`;
 $("candidate-grid").innerHTML=candidates.map(c=>{const selected=selectedTeam.includes(c.id);return `<article class="candidate panel ${selected?"selected":""}"><div class="candidate-top"><div class="candidate-avatar">${candidatePortrait(c)}</div><span class="candidate-role">${c.role}</span></div><h3>${c.name}</h3><p class="candidate-meta">${c.age} AÑOS · ${c.trait}</p><p>${c.bio}</p><div class="candidate-detail"><b>FORTALEZA</b><span>${c.strength}</span></div><div class="candidate-detail"><b>PUNTO DÉBIL</b><span>${c.weakness}</span></div><div class="candidate-skill"><b>${c.skill}</b><span>${c.bonus}</span></div><blockquote>${c.quote}</blockquote><button class="${selected?"primary":"secondary"} pick-candidate" data-pick="${c.id}">${selected?"✓ SELECCIONADO":"SELECCIONAR"}</button></article>`}).join("");
 document.querySelectorAll("[data-pick]").forEach(b=>b.addEventListener("click",()=>toggleCandidate(b.dataset.pick)));
 $("confirm-team").disabled=selectedTeam.length!==3;
 $("team-message").textContent=selectedTeam.length===3?"Equipo completo. Confirmá para guardar tu selección.":`Te falta${3-selectedTeam.length===1?"":"n"} ${3-selectedTeam.length} selección${3-selectedTeam.length===1?"":"es"}.`;
 $("chosen-list").textContent=state.teamConfirmed?state.team.map(id=>candidates.find(c=>c.id===id)?.name).filter(Boolean).join(" · "):"Aún no hay integrantes confirmados.";
}
let selectedTeam=state.teamConfirmed?[...state.team]:[];
function toggleCandidate(id){if(selectedTeam.includes(id)){selectedTeam=selectedTeam.filter(x=>x!==id)}else if(selectedTeam.length<3){selectedTeam.push(id)}else{$("team-message").textContent="Ya elegiste tres integrantes. Quitá uno para elegir a otra persona.";return}renderTeam()}
$("confirm-team").addEventListener("click",()=>{if(selectedTeam.length!==3)return;state.team=[...selectedTeam];state.teamConfirmed=true;save();$("team-message").textContent="Equipo confirmado. ¡Listos para el primer destino!";});
function award(name,xp,skill){state.xp+=xp;state.completed++;state.skills[skill]=Math.min(10,(state.skills[skill]||1)+1);while(state.xp>=xpNeeded()){state.xp-=xpNeeded();state.level++}state.history.push({name,xp,date:new Date().toLocaleDateString("es-AR")});save()}
const titles={inicio:"CENTRO DE ENTRENAMIENTO",equipo:"ASIGNACIÓN DE PERSONAL",operaciones:"CENTRO DE OPERACIONES",entrenamiento:"ÁREA DE INSTRUCCIÓN",perfil:"EXPEDIENTE DEL CADETE"};
function showPage(id){if((id==="entrenamiento"||id==="operaciones")&&!state.teamConfirmed){id="equipo";$("team-message").textContent="Antes de entrenar, confirmá a los tres integrantes de tu equipo."}document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active-page",p.id===id));if(id==="operaciones")renderOperations();document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.section===id));$("page-title").textContent=titles[id]||titles.inicio}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
$("start-training").addEventListener("click",()=>showPage(state.teamConfirmed?"entrenamiento":"equipo"));
$("join-date").textContent=new Date().toLocaleDateString("es-AR");
$("advance-month").addEventListener("click",advanceMonth);
document.querySelectorAll("[data-test]").forEach(b=>b.addEventListener("click",()=>startTest(b.dataset.test)));
let selectedDifficulty="easy";
let memoryTimer=null;
const difficultyDescriptions={easy:"Pruebas introductorias para desarrollar tus aptitudes.",normal:"Desafíos que requieren atención y planificación.",hard:"Pruebas exigentes que combinan varias aptitudes.",special:"Desafíos especiales de liderazgo y toma de decisiones."};
document.querySelectorAll("[data-difficulty]").forEach(tab=>tab.addEventListener("click",()=>{selectedDifficulty=tab.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(t=>{const active=t===tab;t.classList.toggle("active",active);t.setAttribute("aria-selected",String(active))});$("difficulty-description").textContent=difficultyDescriptions[selectedDifficulty];$("exercise").innerHTML='<div class="exercise-empty-mark">R</div><span class="eyebrow">SALA DE PRUEBAS</span><h3>Seleccioná una actividad</h3><p class="muted">Dificultad actualizada. Elegí cualquiera de las cinco disciplinas.</p>'}));
document.querySelectorAll("[data-difficulty-card]").forEach(card=>card.hidden=false);
function startTest(type){
 if(memoryTimer!==null){clearTimeout(memoryTimer);memoryTimer=null}
 if(!state.teamConfirmed){showPage("equipo");return}
 const box=$("exercise");box.scrollIntoView({behavior:"smooth",block:"start"});
 const level={easy:0,normal:1,hard:2,special:3}[selectedDifficulty]??0;
 const xp=[15,20,25,30][level];
 const heading=(tag,title,desc)=>{box.innerHTML=`<div class="exercise-heading"><span class="eyebrow">EVALUACIÓN · ${tag} · ${selectedDifficulty.toUpperCase()}</span><h3>${title}</h3><p>${desc}</p><span class="exercise-reward">+ ${xp} XP</span></div><div class="exercise-task" id="exercise-task"></div>`;return $("exercise-task")};
 const choices=(task,items,correct,name,skill)=>items.forEach(v=>addChoice(task,v,()=>finish(box,v===correct,name,skill,xp)));
 if(type==="memory"){
  const symbols=["▲","●","◆","■","★","⬟"],length=[4,6,8,10][level],sequence=Array.from({length},()=>symbols[Math.floor(Math.random()*symbols.length)]);
  const task=heading("MEMORIA","Retención de secuencia",`Memorizá ${length} símbolos. La secuencia se ocultará automáticamente.`);
  task.innerHTML=`<div class="memory-sequence" id="sequence">${sequence.join("　")}</div><p class="muted">Prepará tu respuesta antes de que termine el tiempo.</p><button class="primary" id="ready">OCULTAR Y RESPONDER</button>`;
  const hide=()=>{$("sequence").textContent="SECUENCIA OCULTA";$("ready").remove();const correct=sequence.join(" ");const options=[correct];for(let k=0;k<3;k++){let alt=[...sequence];const pos=(k*2+level)%length;alt[pos]=symbols.find(x=>x!==alt[pos]);options.push(alt.join(" "))}shuffle(options).forEach(v=>addChoice(task,v,()=>finish(box,v===correct,"Memoria","Inteligencia",xp)))};
  $("ready").onclick=()=>{if(memoryTimer!==null)clearTimeout(memoryTimer);memoryTimer=null;hide()};memoryTimer=setTimeout(()=>{memoryTimer=null;if($("ready"))hide()},[7500,5600,4100,2900][level]);
 }
 if(type==="logistics"){
  const start=level===0?24:level===1?86:level===2?145:275,boxes=start+Math.floor(Math.random()*30),reserve=level===0?8:level===1?17:level===2?26:43,damaged=level===0?2:level===1?5:level===2?9:14,needed=boxes+reserve-damaged;
  const task=heading("LOGÍSTICA","Balance de suministros","Calculá el total disponible después de sumar la reserva y descontar el material dañado.");
  task.innerHTML=`<div class="supply-equation"><span>DEPÓSITO <b>${boxes}</b></span><span>RESERVA <b>+${reserve}</b></span><span>DAÑADO <b>−${damaged}</b></span></div><p>¿Cuántas unidades utilizables quedan?</p>`;
  const vals=shuffle([needed,needed+damaged,needed-reserve,needed+(level+1)*7]);choices(task,vals,needed,"Balance logístico","Disciplina");
 }
 if(type==="logic"){
  const n=level===0?3:level===1?5:level===2?7:9,seq=level===0?[n,n+3,n+6,n+9]:level===1?[n,n*2,n*4,n*8]:level===2?[n,n+2,n+6,n+12]:[n,n*2+1,n*4+3,n*8+7],answer=level===0?seq[3]+3:level===1?seq[3]*2:level===2?seq[3]+8:seq[3]*2+1;
  const task=heading("RAZONAMIENTO","Patrón de progresión","Identificá la regla que conecta todos los términos y elegí el siguiente valor.");
  task.innerHTML=`<div class="logic-sequence">${seq.join("<span> / </span>")}<b>?</b></div><p>¿Qué número continúa la secuencia?</p>`;
  choices(task,shuffle([answer,answer+2,answer-3,answer+Math.max(5,n)]),answer,"Razonamiento lógico","Inteligencia");
 }
 if(type==="coordination"){
  const symbols=["▲","●","◆","■"],target=symbols[Math.floor(Math.random()*4)],count=[9,16,25,36][level],items=Array.from({length:count},(_,i)=>i%[3,4,5,6][level]===0?target:symbols[(symbols.indexOf(target)+1+(i%3))%4]);
  const task=heading("ATENCIÓN","Detección de patrones","Encontrá el símbolo objetivo entre los distractores. La ubicación cambia en cada intento.");
  task.innerHTML=`<p class="target-symbol">OBJETIVO: <b>${target}</b></p><div class="symbol-grid" style="--symbol-cols:${[3,4,5,6][level]}">${items.map((v,i)=>`<button class="symbol-cell" data-symbol-index="${i}">${v}</button>`).join("")}</div>`;
  task.querySelectorAll("[data-symbol-index]").forEach((el,i)=>el.onclick=()=>finish(box,items[i]===target,"Atención visual","Coordinación",xp));
 }
 if(type==="leadership"){
  const cases=[
   {q:"Dos tareas urgentes compiten por el mismo recurso. ¿Qué hacés primero?",opts:["Comparo impacto y plazo, consulto al equipo y explico la prioridad.","Asigno el recurso a la tarea más sencilla para terminar rápido.","Decido sin compartir el criterio para evitar discusiones.","Espero a que otro integrante resuelva el conflicto."],ok:0},
   {q:"Un informe importante contiene un dato que contradice dos registros anteriores.",opts:["Verifico el origen, documento la discrepancia y solicito confirmación.","Reemplazo los registros anteriores por el informe nuevo.","Ignoro el dato para no retrasar el trabajo.","Promedio los valores aunque midan cosas distintas."],ok:0},
   {q:"Un integrante cumple su tarea, pero el resto del equipo queda retrasado.",opts:["Reviso el cuello de botella y redistribuyo tareas sin perder responsabilidades.","Le asigno todas las tareas pendientes al mismo integrante.","Mantengo el reparto aunque ya no funcione.","Cancelo el trabajo del equipo sin revisar alternativas."],ok:0},
   {q:"La información disponible no alcanza para tomar una decisión segura.",opts:["Identifico qué falta, pido datos y comunico qué decisión puede esperar.","Completo los datos con una suposición razonable.","Elijo la opción más rápida y no registro la incertidumbre.","Transfiero toda la responsabilidad a otra persona."],ok:0}
  ][level];
  const task=heading("LIDERAZGO","Evaluación de criterio",cases.q);
  const leadershipOptions=[...cases.opts],leadershipCorrect=leadershipOptions[cases.ok];
  const randomizedLeadershipOptions=shuffle(leadershipOptions);
  choices(task,randomizedLeadershipOptions,leadershipCorrect,"Criterio de liderazgo","Liderazgo");
 }
}
function addChoice(box,value,fn){let b=document.createElement("button");b.className="choice";b.textContent=value;b.onclick=fn;box.appendChild(b)}
function finish(box,correct,name,skill,gained){box.querySelectorAll("button").forEach(b=>b.disabled=true);if(correct){award(name,gained,skill);box.insertAdjacentHTML("beforeend",`<p class="feedback">✓ PRUEBA SUPERADA · +${gained} XP</p>`)}else{box.insertAdjacentHTML("beforeend",'<p class="feedback">Prueba no superada. Podés intentarlo nuevamente.</p>')}let again=document.createElement("button");again.className="secondary";again.textContent="VOLVER A ENTRENAMIENTO";again.onclick=()=>{box.innerHTML='<span class="eyebrow">SALA DE PRUEBAS</span><h3>Seleccioná una actividad</h3><p class="muted">Tus resultados se registrarán en tu expediente.</p>'};box.appendChild(again)}



const supplyMission={
 resources:{agua:8,alimentos:7,medicina:5},
 places:[
  {id:"norte",name:"Barrio Norte",need:{agua:3,alimentos:2,medicina:1},note:"Familias que necesitan agua potable y alimentos"},
  {id:"sur",name:"Villa Sur",need:{agua:2,alimentos:3,medicina:2},note:"Centro vecinal con mayor demanda de alimentos"},
  {id:"escuela",name:"Escuela Rural",need:{agua:3,alimentos:2,medicina:2},note:"Punto de asistencia para estudiantes y personal"}
 ],
 labels:{agua:"Agua",alimentos:"Alimentos",medicina:"Botiquines"}
};
function emptyAllocations(){return {norte:{agua:0,alimentos:0,medicina:0},sur:{agua:0,alimentos:0,medicina:0},escuela:{agua:0,alimentos:0,medicina:0}}}
function renderOperations(){
 $("operation-history").innerHTML=state.operations.length?state.operations.slice().reverse().map(o=>`<p>✓ ${o.name} · ${o.grade} · +${o.xp} XP <span class="muted">· ${o.date}</span></p>`).join(""):"Todavía no completaste ninguna operación.";
 const done=state.operations.some(o=>o.id==="first-destination");
 $("begin-operation").textContent=done?"OPERACIÓN COMPLETADA":state.operationProgress?"CONTINUAR OPERACIÓN →":"INICIAR OPERACIÓN →";
 $("begin-operation").disabled=done||!state.teamConfirmed;
 $("begin-operation").onclick=beginOperation;
 $("operation-status").textContent=done?"Operación completada":state.operationProgress?"Operación en curso":"Esperando asignación";
 $("operation-summary").textContent=done?"La primera misión ya figura en tu expediente.":state.operationProgress?"Tu distribución quedó guardada. Podés continuar desde donde la dejaste.":"Prepará al equipo y organizá los suministros para tres puntos de asistencia.";
 if(state.operationProgress&&!done)showOperationStep();
}
function beginOperation(){
 if(!state.teamConfirmed){showPage("equipo");return}
 if(state.operations.some(o=>o.id==="first-destination"))return;
 if(!state.operationProgress)state.operationProgress={mission:"first-destination",stage:"allocation",allocations:emptyAllocations(),attempts:0};
 showOperationStep();
}
function changeAllocation(place,resource,delta){
 const p=state.operationProgress;if(!p||p.stage!=="allocation")return;
 const target=supplyMission.places.find(x=>x.id===place);
 if(!target||!Object.hasOwn(target.need,resource))return;
 const current=p.allocations[place][resource]||0;
 const used=Object.values(p.allocations).reduce((sum,row)=>sum+(Number(row[resource])||0),0);
 const next=current+delta;
 // Doble límite: nunca superar la necesidad local ni el inventario general.
 if(next<0||next>target.need[resource]||used+delta>supplyMission.resources[resource])return;
 p.allocations[place][resource]=next;save();showOperationStep();
}
function showOperationStep(){
 const p=state.operationProgress;if(!p)return;
 if(p.stage==="decisions"){showDecisionStep();return}
 const totals={agua:0,alimentos:0,medicina:0};
 for(const row of Object.values(p.allocations))for(const key of Object.keys(totals))totals[key]+=row[key]||0;
 const resourcesLeft=Object.fromEntries(Object.keys(totals).map(k=>[k,supplyMission.resources[k]-totals[k]]));
 const places=supplyMission.places.map(place=>{
  const cells=Object.keys(totals).map(resource=>{
   const value=p.allocations[place.id][resource]||0,need=place.need[resource];
   const used=Object.values(p.allocations).reduce((sum,row)=>sum+(Number(row[resource])||0),0);
   const left=supplyMission.resources[resource]-used;
   return `<div class="dispatch-cell"><span>${supplyMission.labels[resource]} <b>${value}/${need}</b></span><div class="dispatch-controls"><button type="button" data-adjust="-1" data-place="${place.id}" data-resource="${resource}" aria-label="Quitar ${supplyMission.labels[resource]}" ${value<=0?"disabled":""}>−</button><strong>${value}</strong><button type="button" data-adjust="1" data-place="${place.id}" data-resource="${resource}" aria-label="Agregar ${supplyMission.labels[resource]}" ${value>=need||left<=0?"disabled":""}>+</button></div></div>`;
  }).join("");
  return `<article class="dispatch-location"><div class="dispatch-location-head"><span class="dispatch-pin">◎</span><div><h4>${place.name}</h4><p>${place.note}</p></div></div><div class="dispatch-resource-grid">${cells}</div></article>`;
 }).join("");
 const exact=supplyMission.places.every(place=>Object.keys(totals).every(resource=>p.allocations[place.id][resource]===place.need[resource]));
 $("operation-status").textContent="OPERACIÓN EN CURSO · DISTRIBUCIÓN";
 $("operation-summary").textContent="Equipo: "+state.team.map(id=>candidates.find(c=>c.id===id)?.name).filter(Boolean).join(", ")+". Asigná cada recurso según las necesidades de cada punto.";
 $("operation-content").innerHTML=`<div class="dispatch-hud"><div><span>ETAPA</span><b>01 / 02</b></div><div><span>INTENTOS</span><b>${p.attempts}</b></div><div><span>ESTADO</span><b>${exact?"LISTO PARA VALIDAR":"EN PREPARACIÓN"}</b></div></div><div class="operation-progress"><span style="width:50%"></span></div><div class="dispatch-intro"><span class="eyebrow">TABLERO LOGÍSTICO</span><h3>Distribuí los suministros</h3><p>Tenés un inventario limitado. Usá + y − para asignar cada recurso a los tres puntos. Las cantidades deben coincidir con las necesidades indicadas.</p></div><div class="dispatch-inventory">${Object.keys(totals).map(k=>`<div><span>${supplyMission.labels[k]}</span><b>${resourcesLeft[k]} / ${supplyMission.resources[k]}</b><small>disponibles</small></div>`).join("")}</div><div class="dispatch-map" aria-label="Puntos de asistencia"><div class="dispatch-route"></div><span class="dispatch-map-label">ZONA DE ASISTENCIA · SECTOR 01</span>${places}</div><div class="dispatch-actions"><button class="secondary" id="reset-dispatch">REINICIAR DISTRIBUCIÓN</button><button class="primary" id="validate-dispatch">VERIFICAR DISTRIBUCIÓN →</button></div><p class="operation-feedback" id="dispatch-feedback" aria-live="polite">${p.attempts?"Revisá los requerimientos y volvé a intentarlo.":"No hay penalización por probar distintas distribuciones."}</p>`;
 document.querySelectorAll("[data-adjust]").forEach(b=>b.onclick=()=>changeAllocation(b.dataset.place,b.dataset.resource,Number(b.dataset.adjust)));
 $("reset-dispatch").onclick=()=>{p.allocations=emptyAllocations();save();showOperationStep()};
 $("validate-dispatch").onclick=validateDispatch;
}
function validateDispatch(){
 const p=state.operationProgress;if(!p)return;
 const misses=[];
 supplyMission.places.forEach(place=>Object.keys(place.need).forEach(resource=>{if(p.allocations[place.id][resource]!==place.need[resource])misses.push({place:place.name,resource:supplyMission.labels[resource]})}));
 if(misses.length){p.attempts++;save();showOperationStep();$("dispatch-feedback").textContent="Todavía hay "+misses.length+" asignaciones incorrectas. Revisá las cantidades de cada localidad y probá de nuevo.";return}
 // La distribución correcta desbloquea la fase de decisiones de campo.
 p.stage="decisions";p.decisionIndex=0;p.decisionScore=0;p.decisionErrors=0;p.decisions=[];
 save();showDecisionStep();
}
const operationDecisions=[
 {title:"Demora en el traslado",brief:"El traslado al Barrio Norte se demora. Los otros dos puntos ya confirmaron que pueden recibir sus suministros.",question:"¿Cómo reorganizás el trabajo?",options:["Confirmo el nuevo horario, aviso a los tres puntos y reorganizo el orden sin perder el control de las entregas.","Cambio el orden sin avisar para ganar unos minutos.","Doy por entregado el material aunque todavía no llegó."],correct:0,explain:"La coordinación y la información compartida evitan confusiones."},
 {title:"Cambio en la demanda",brief:"La Escuela Rural informa que su cantidad de asistentes cambió, pero el mensaje no incluye una cifra confirmada.",question:"¿Cuál es tu siguiente paso?",options:["Pido confirmación del dato y registro el cambio antes de modificar el inventario.","Aumento los suministros usando una estimación propia.","Ignoro el aviso y cierro el informe."],correct:0,explain:"Verificar el dato evita asignaciones basadas en suposiciones."},
 {title:"Registro de recepción",brief:"Dos integrantes informan cantidades distintas sobre los suministros recibidos en Villa Sur.",question:"¿Cómo resolvés la diferencia?",options:["Comparo el registro de salida con la confirmación de recepción y dejo constancia de la diferencia.","Elijo el número más alto para terminar rápido.","Borro ambos registros y continúo."],correct:0,explain:"La trazabilidad permite detectar errores y mantener un registro confiable."}
];
function showDecisionStep(){
 const p=state.operationProgress;if(!p||p.stage!=="decisions")return;
 const index=Math.min(p.decisionIndex||0,operationDecisions.length-1),event=operationDecisions[index];
 $("operation-status").textContent="OPERACIÓN EN CURSO · COORDINACIÓN";
 $("operation-summary").textContent="La distribución fue completada. Ahora resolvé los imprevistos junto al equipo.";
 $("operation-content").innerHTML=`<div class="dispatch-hud"><div><span>ETAPA</span><b>02 / 02</b></div><div><span>DECISIÓN</span><b>${index+1} / ${operationDecisions.length}</b></div><div><span>CRITERIO</span><b>${p.decisionScore||0} / 100</b></div></div><div class="operation-progress"><span style="width:${Math.round((index/operationDecisions.length)*100)}%"></span></div><section class="dispatch-event"><span class="eyebrow">INFORME DE SITUACIÓN · ${String(index+1).padStart(2,"0")}</span><h3>${event.title}</h3><p>${event.brief}</p><div class="dispatch-event-question"><b>${event.question}</b></div><div class="operation-choices" id="decision-options">${event.options.map((option,i)=>`<button class="operation-choice" type="button" data-decision="${i}"><span class="decision-letter">${String.fromCharCode(65+i)}</span>${option}</button>`).join("")}</div><p class="operation-feedback" id="decision-feedback" aria-live="polite">Elegí una respuesta. Cada decisión influye en el resultado final.</p></section>`;
 document.querySelectorAll("[data-decision]").forEach(button=>button.onclick=()=>resolveDecision(Number(button.dataset.decision)));
}
function resolveDecision(choice){
 const p=state.operationProgress;if(!p||p.stage!=="decisions")return;
 const index=p.decisionIndex||0,event=operationDecisions[index];if(!event||p.decisions?.includes(index))return;
 const correct=choice===event.correct;
 p.decisions=Array.isArray(p.decisions)?p.decisions:[];
 p.decisions.push(index);
 if(correct)p.decisionScore=(p.decisionScore||0)+Math.round(100/operationDecisions.length);
 else p.decisionErrors=(p.decisionErrors||0)+1;
 save();
 const options=$("decision-options");if(options)options.querySelectorAll("button").forEach((button,i)=>{button.disabled=true;if(i===event.correct)button.classList.add("decision-correct");else if(i===choice)button.classList.add("decision-wrong")});
 const feedback=$("decision-feedback");
 if(feedback)feedback.textContent=(correct?"✓ Buena decisión. ":"✕ Esa decisión puede generar problemas. ")+event.explain;
 const next=document.createElement("button");next.className="primary";next.textContent=index===operationDecisions.length-1?"CERRAR INFORME →":"SIGUIENTE SITUACIÓN →";
 next.onclick=()=>{p.decisionIndex=index+1;if(p.decisionIndex>=operationDecisions.length)completeOperation();else{save();showDecisionStep()}};
 $("operation-content").appendChild(next);
}
function completeOperation(){
 if(!state.operationProgress||state.operations.some(o=>o.id==="first-destination"))return;
 const progress=state.operationProgress;
 const attempts=progress.attempts||0,decisionScore=progress.decisionScore||0,errors=progress.decisionErrors||0;
 const score=Math.round(decisionScore);
 const xp=score>=99&&attempts===0?65:score>=66?52:score>=33?40:30;
 const grade=score>=99&&attempts===0?"DESTACADA":score>=66?"SATISFACTORIA":score>=33?"EN DESARROLLO":"COMPLETADA";
 state.operations.push({id:"first-destination",name:"PRIMER DESTINO",grade,xp,date:campaignDate(),score,decisionErrors:errors,allocationAttempts:attempts});
 state.operationProgress=null;
 award("Operación: Primer destino",xp,"Coordinación");
 $("operation-status").textContent="MISIÓN COMPLETADA · "+grade;
 $("operation-summary").textContent="La distribución y las decisiones de coordinación fueron registradas en el informe final.";
 $("operation-content").innerHTML=`<div class="operation-result"><span>RESULTADO FINAL</span><strong>${grade}</strong><b>+${xp} XP</b><p>Distribución correcta · ${attempts} intentos de ajuste.</p><p>Criterio operativo: ${score}/100 · Decisiones incorrectas: ${errors}.</p><p>${state.team.map(id=>candidates.find(c=>c.id===id)?.name).filter(Boolean).join(" · ")} completaron la misión con vos.</p></div><button class="secondary" id="return-operations">VOLVER AL CENTRO DE MANDO</button>`;
 $("return-operations").onclick=()=>showPage("inicio");renderOperations();
}


// Revalidar cualquier partida anterior contra las necesidades reales y el inventario.
if(state.operationProgress?.mission==="first-destination"){
 const p=state.operationProgress;
 if(p.stage==="allocation"){
  const clean=emptyAllocations();
  for(const place of supplyMission.places)for(const resource of Object.keys(place.need)){
   const raw=Number(p.allocations?.[place.id]?.[resource])||0;
   clean[place.id][resource]=Math.max(0,Math.min(place.need[resource],Math.floor(raw)));
  }
  for(const resource of Object.keys(supplyMission.resources)){
   let used=0;
   for(const place of supplyMission.places){const value=clean[place.id][resource];if(used+value>supplyMission.resources[resource])clean[place.id][resource]=Math.max(0,supplyMission.resources[resource]-used);used+=clean[place.id][resource];}
  }
  p.allocations=clean;p.attempts=Number.isInteger(p.attempts)&&p.attempts>=0?p.attempts:0;
 }else if(p.stage==="decisions"){
  p.decisionIndex=Math.max(0,Math.min(operationDecisions.length-1,Number(p.decisionIndex)||0));
  p.decisionScore=Math.max(0,Math.min(100,Number(p.decisionScore)||0));
  p.decisionErrors=Math.max(0,Number(p.decisionErrors)||0);
  p.decisions=Array.isArray(p.decisions)?p.decisions.filter(Number.isInteger):[];
 }else state.operationProgress=null;
}
function enterGame(){ $("lobby").hidden=true;$("game-app").hidden=false;showPage(state.teamConfirmed?"inicio":"equipo");window.scrollTo({top:0,behavior:"smooth"}); }
$("new-game").addEventListener("click",()=>{if(localStorage.getItem("recluta-save")&&!confirm("¿Empezar una partida nueva? El progreso local actual se reemplazará."))return;state={xp:0,level:1,completed:0,skills:{Disciplina:1,Resistencia:1,Inteligencia:1,Coordinación:1,Liderazgo:1},history:[],team:[],teamConfirmed:false,campaignMonth:0,campaignLog:[],operations:[],operationProgress:null};selectedTeam=[];save();enterGame()});
$("continue-game").addEventListener("click",enterGame);
const lobbyDetailData={
partidas:["ARCHIVO DE PARTIDAS","Mis partidas",()=>`<div class="detail-stat-grid"><div><b>${state.teamConfirmed?"ACTIVA":"SIN INICIAR"}</b><small>Estado de carrera</small></div><div><b>${campaignDate()}</b><small>Período actual</small></div><div><b>NIVEL ${state.level}</b><small>${state.xp} XP acumulados en el nivel</small></div></div><p>Tu partida se guarda automáticamente en este navegador. Para jugar en otro dispositivo necesitaremos implementar exportación o cuentas con servidor.</p><button class="detail-action" id="detail-continue">ABRIR MI PARTIDA →</button>`],
logros:["REGISTRO DE MÉRITOS","Logros",()=>`<div class="detail-list"><div><b>${state.completed>0?"✓":"○"} Primeros pasos</b><span>Completá tu primera prueba · ${state.completed>0?"Desbloqueado":"Pendiente"}</span></div><div><b>${state.teamConfirmed?"✓":"○"} Trabajo en equipo</b><span>Confirmá tu equipo · ${state.teamConfirmed?"Desbloqueado":"Pendiente"}</span></div><div><b>${state.level>=5?"✓":"○"} Carrera en ascenso</b><span>Alcanzá el nivel 5 · ${state.level>=5?"Desbloqueado":"Pendiente"}</span></div></div><p>Los reconocimientos se desbloquean jugando. No hace falta conectarse todos los días.</p>`],
historial:["REGISTRO DE ACTIVIDAD","Historial",()=>state.history.length?`<div class="detail-list">${state.history.slice().reverse().map((x,i)=>`<div><b>${x.name}</b><span>+${x.xp} XP · ${x.date}</span></div>`).join("")}</div>`:`<p>Todavía no hay actividades registradas. Cuando completes una prueba, aparecerá acá.</p>`],
ayuda:["GUÍA DE INGRESO","Manual del cadete",()=>`<div class="detail-list"><div><b>01 · Formá tu equipo</b><span>Elegí tres compañeros entre los cinco aspirantes.</span></div><div><b>02 · Entrená</b><span>Completá desafíos de memoria, logística, lógica, coordinación y liderazgo.</span></div><div><b>03 · Progresá</b><span>Ganás experiencia y mejorás tus aptitudes.</span></div><div><b>04 · Avanzá la campaña</b><span>El calendario avanza cuando vos pulsás el botón. No hay penalización por descansar.</span></div></div>`],
planes:["INFORMACIÓN DEL PROYECTO","Estado del proyecto",()=>`<p>RECLUTA es un proyecto independiente en desarrollo. Todas las funciones disponibles actualmente son gratuitas.</p><p>No hay compras, suscripciones ni funciones de pago.</p>`],
ajustes:["PREFERENCIAS LOCALES","Configuración",()=>`<div class="detail-setting"><label for="reduce-motion">Reducir animaciones</label><input id="reduce-motion" type="checkbox" ${localStorage.getItem("recluta-reduce-motion")==="1"?"checked":""}></div><p>La preferencia se aplica en este dispositivo.</p>`],
contacto:["COMUNICACIÓN","Contacto",()=>`<p>RECLUTA es un proyecto independiente en desarrollo. Todavía no hay un canal de soporte público. Por ahora, podés informar errores directamente en el repositorio del proyecto.</p><a class="detail-link" href="https://github.com/REDARMY2026-fal/Recluta/issues" target="_blank" rel="noopener">Ver reportes del proyecto ↗</a>`]
};
document.querySelectorAll("[data-lobby-info]").forEach(b=>b.addEventListener("click",()=>{const data=lobbyDetailData[b.dataset.lobbyInfo];if(!data)return;$("lobby-detail-kicker").textContent=data[0];$("lobby-detail-title").textContent=data[1];$("lobby-detail-content").innerHTML=data[2]();$("lobby-detail").hidden=false;$("lobby-message").textContent=data[1]+" · Información abierta."; $("lobby-detail").scrollIntoView({behavior:"smooth",block:"nearest"});const cont=$("detail-continue");if(cont)cont.onclick=enterGame;const reduce=$("reduce-motion");if(reduce)reduce.onchange=()=>{localStorage.setItem("recluta-reduce-motion",reduce.checked?"1":"0");document.body.classList.toggle("reduce-motion",reduce.checked)};}));
$("lobby-detail-close").addEventListener("click",()=>{$("lobby-detail").hidden=true});
if(localStorage.getItem("recluta-reduce-motion")==="1")document.body.classList.add("reduce-motion");

// Google Analytics: solo se carga si la persona acepta.
const RECLUTA_GA_ID="G-KS7WJNEC0W";
function enableAnalytics(){
 if(window.reclutaAnalyticsLoaded)return;
 window.reclutaAnalyticsLoaded=true;
 window.dataLayer=window.dataLayer||[];
 function gtag(){window.dataLayer.push(arguments)}
 window.gtag=gtag;
 gtag("js",new Date());
 gtag("config",RECLUTA_GA_ID,{anonymize_ip:true});
 const tag=document.createElement("script");
 tag.async=true;
 tag.src="https://www.googletagmanager.com/gtag/js?id="+RECLUTA_GA_ID;
 document.head.appendChild(tag);
}
const analyticsConsent=localStorage.getItem("recluta-analytics-consent");
if(analyticsConsent==="yes")enableAnalytics();
if(!analyticsConsent&&$("analytics-consent"))$("analytics-consent").hidden=false;
if($("analytics-accept"))$("analytics-accept").addEventListener("click",()=>{localStorage.setItem("recluta-analytics-consent","yes");$("analytics-consent").hidden=true;enableAnalytics()});
if($("analytics-reject"))$("analytics-reject").addEventListener("click",()=>{localStorage.setItem("recluta-analytics-consent","no");$("analytics-consent").hidden=true});

render();
renderOperations();
if(!state.teamConfirmed)showPage("equipo");
