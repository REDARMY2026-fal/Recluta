const defaultState={xp:0,level:1,completed:0,skills:{Disciplina:1,Resistencia:1,Inteligencia:1,Coordinación:1,Liderazgo:1},history:[],team:[],teamConfirmed:false,campaignMonth:0,campaignLog:[],operations:[],operationProgress:null};
let state;
try{state={...defaultState,...JSON.parse(localStorage.getItem("recluta-save")||"{}")};state.skills={...defaultState.skills,...(state.skills||{})};state.history=state.history||[];state.team=Array.isArray(state.team)?state.team:[];state.campaignMonth=Number.isInteger(state.campaignMonth)&&state.campaignMonth>=0?state.campaignMonth:0;state.campaignLog=Array.isArray(state.campaignLog)?state.campaignLog:[];state.operations=Array.isArray(state.operations)?state.operations:[];state.operationProgress=state.operationProgress||null;}catch{state={...defaultState}}
const ranks=["Recluta","Soldado","Cabo","Sargento","Teniente","Capitán","Mayor","Coronel","General"];
const candidates=[
{id:"martin",name:"Martín Sosa",age:21,role:"Logística",trait:"Organizado · responsable · detallista",strength:"Planificación y control de suministros",weakness:"A veces piensa demasiado antes de actuar.",skill:"PLAN B",bio:"Ayudaba en el negocio familiar y aprendió a resolver problemas con recursos limitados.",quote:"«Si tenemos un plan, también tenemos que tener una alternativa.»",bonus:"Mejor criterio en desafíos de organización."},
{id:"tomas",name:"Tomás Ferreyra",age:20,role:"Comunicaciones",trait:"Creativo · curioso · bromista",strength:"Tecnología e interpretación de información",weakness:"Puede distraerse cuando algo le interesa demasiado.",skill:"SEÑAL CLARA",bio:"Siempre tuvo curiosidad por la tecnología y disfruta encontrar soluciones poco convencionales.",quote:"«Pará, creo que encontré una forma más sencilla.»",bonus:"Aporta una mirada creativa a los problemas."},
{id:"valentina",name:"Valentina Ríos",age:22,role:"Coordinación",trait:"Empática · decidida · observadora",strength:"Trabajo en equipo y organización de personas",weakness:"A veces asume demasiadas responsabilidades.",skill:"TRABAJO EN EQUIPO",bio:"Participó en proyectos comunitarios y aprendió a escuchar y coordinar grupos.",quote:"«Primero escuchemos a todos. Después decidimos.»",bonus:"Ayuda a equilibrar decisiones grupales."},
{id:"lucas",name:"Lucas Benítez",age:21,role:"Análisis",trait:"Paciente · analítico · reservado",strength:"Detectar patrones y evaluar información",weakness:"Le cuesta decidir cuando faltan datos.",skill:"LECTURA DE DATOS",bio:"Se destacó en competencias académicas y disfruta resolver enigmas y ordenar información.",quote:"«Hay un detalle que todavía no estamos viendo.»",bonus:"Útil en pruebas de lógica y análisis."},
{id:"camila",name:"Camila Torres",age:20,role:"Asistencia y personal",trait:"Práctica · sociable · perseverante",strength:"Administrar tiempos y distribuir tareas",weakness:"Puede frustrarse cuando el grupo no se organiza.",skill:"ORDEN DE EQUIPO",bio:"Organizaba actividades de voluntariado y sabe adaptar los planes cuando cambian las necesidades.",quote:"«Cada persona puede aportar algo. Organicemos las tareas.»",bonus:"Útil en coordinación y decisiones de equipo."}
];
const $=id=>document.getElementById(id);
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
function renderTeam(){
 $("team-count").textContent=`${selectedTeam.length} / 3`;
 $("candidate-grid").innerHTML=candidates.map(c=>{const selected=selectedTeam.includes(c.id);return `<article class="candidate panel ${selected?"selected":""}"><div class="candidate-top"><div class="candidate-avatar">${c.name.split(" ").map(x=>x[0]).join("")}</div><span class="candidate-role">${c.role}</span></div><h3>${c.name}</h3><p class="candidate-meta">${c.age} AÑOS · ${c.trait}</p><p>${c.bio}</p><div class="candidate-detail"><b>FORTALEZA</b><span>${c.strength}</span></div><div class="candidate-detail"><b>PUNTO DÉBIL</b><span>${c.weakness}</span></div><div class="candidate-skill"><b>${c.skill}</b><span>${c.bonus}</span></div><blockquote>${c.quote}</blockquote><button class="${selected?"primary":"secondary"} pick-candidate" data-pick="${c.id}">${selected?"✓ SELECCIONADO":"SELECCIONAR"}</button></article>`}).join("");
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
const difficultyDescriptions={easy:"Pruebas introductorias para desarrollar tus aptitudes.",normal:"Desafíos que requieren atención y planificación.",hard:"Pruebas exigentes que combinan varias aptitudes.",special:"Desafíos especiales de liderazgo y toma de decisiones."};
document.querySelectorAll("[data-difficulty]").forEach(tab=>tab.addEventListener("click",()=>{selectedDifficulty=tab.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(t=>{const active=t===tab;t.classList.toggle("active",active);t.setAttribute("aria-selected",String(active))});document.querySelectorAll("[data-difficulty-card]").forEach(card=>card.hidden=card.dataset.difficultyCard!==selectedDifficulty);$("difficulty-description").textContent=difficultyDescriptions[selectedDifficulty]}));
document.querySelectorAll("[data-difficulty-card]").forEach(card=>card.hidden=card.dataset.difficultyCard!=="easy");
function startTest(type){
 if(!state.teamConfirmed){showPage("equipo");return}
 const box=$("exercise");box.scrollIntoView({behavior:"smooth",block:"start"});
 const level={easy:0,normal:1,hard:2,special:3}[selectedDifficulty]??0;
 const xp=[15,20,25,30][level];
 const heading=(tag,title,desc)=>{box.innerHTML=`<div class="exercise-heading"><span class="eyebrow">EVALUACIÓN · ${tag} · ${selectedDifficulty.toUpperCase()}</span><h3>${title}</h3><p>${desc}</p><span class="exercise-reward">+ ${xp} XP</span></div><div class="exercise-task" id="exercise-task"></div>`;return $("exercise-task")};
 const choices=(task,items,correct,name,skill)=>items.forEach(v=>addChoice(task,v,()=>finish(box,v===correct,name,skill)));
 if(type==="memory"){
  const symbols=["▲","●","◆","■","★","⬟"],length=[4,6,8,10][level],sequence=Array.from({length},()=>symbols[Math.floor(Math.random()*symbols.length)]);
  const task=heading("MEMORIA","Retención de secuencia",`Memorizá ${length} símbolos. La secuencia se ocultará automáticamente.`);
  task.innerHTML=`<div class="memory-sequence" id="sequence">${sequence.join("　")}</div><p class="muted">Prepará tu respuesta antes de que termine el tiempo.</p><button class="primary" id="ready">OCULTAR Y RESPONDER</button>`;
  const hide=()=>{$("sequence").textContent="SECUENCIA OCULTA";$("ready").remove();const correct=sequence.join(" ");const options=[correct];for(let k=0;k<3;k++){let alt=[...sequence];const pos=(k*2+level)%length;alt[pos]=symbols.find(x=>x!==alt[pos]);options.push(alt.join(" "))}options.sort(()=>Math.random()-.5).forEach(v=>addChoice(task,v,v===correct?"correct":null,"Memoria","Inteligencia"))};
  $("ready").onclick=hide;if(level>0)setTimeout(()=>{if($("ready"))hide()},Math.max(1800,5200-level*900));
 }
 if(type==="logistics"){
  const start=level===0?24:level===1?86:level===2?145:275,boxes=start+Math.floor(Math.random()*30),reserve=level===0?8:level===1?17:level===2?26:43,damaged=level===0?2:level===1?5:level===2?9:14,needed=boxes+reserve-damaged;
  const task=heading("LOGÍSTICA","Balance de suministros","Calculá el total disponible después de sumar la reserva y descontar el material dañado.");
  task.innerHTML=`<div class="supply-equation"><span>DEPÓSITO <b>${boxes}</b></span><span>RESERVA <b>+${reserve}</b></span><span>DAÑADO <b>−${damaged}</b></span></div><p>¿Cuántas unidades utilizables quedan?</p>`;
  const vals=[needed,needed+damaged,needed-reserve,needed+(level+1)*7].sort(()=>Math.random()-.5);choices(task,vals,needed,"Balance logístico","Disciplina");
 }
 if(type==="logic"){
  const n=level===0?3:level===1?5:level===2?7:9,seq=level===0?[n,n+3,n+6,n+9]:level===1?[n,n*2,n*4,n*8]:level===2?[n,n+2,n+6,n+12]:[n,n*2+1,n*4+3,n*8+7],answer=level===0?seq[3]+3:level===1?seq[3]*2:level===2?seq[3]+8:seq[3]*2+15;
  const task=heading("RAZONAMIENTO","Patrón de progresión","Identificá la regla que conecta todos los términos y elegí el siguiente valor.");
  task.innerHTML=`<div class="logic-sequence">${seq.join("<span> / </span>")}<b>?</b></div><p>¿Qué número continúa la secuencia?</p>`;
  choices(task,[answer,answer+2,answer-3,answer+Math.max(5,n)].sort(()=>Math.random()-.5),answer,"Razonamiento lógico","Inteligencia");
 }
 if(type==="coordination"){
  const symbols=["▲","●","◆","■"],target=symbols[Math.floor(Math.random()*4)],count=[9,16,25,36][level],items=Array.from({length:count},(_,i)=>i%[3,4,5,6][level]===0?target:symbols[(symbols.indexOf(target)+1+(i%3))%4]);
  const task=heading("ATENCIÓN","Detección de patrones","Encontrá el símbolo objetivo entre los distractores. La ubicación cambia en cada intento.");
  task.innerHTML=`<p class="target-symbol">OBJETIVO: <b>${target}</b></p><div class="symbol-grid" style="--symbol-cols:${[3,4,5,6][level]}">${items.map((v,i)=>`<button class="symbol-cell" data-symbol-index="${i}">${v}</button>`).join("")}</div>`;
  task.querySelectorAll("[data-symbol-index]").forEach((el,i)=>el.onclick=()=>finish(box,items[i]===target,"Atención visual","Coordinación"));
 }
 if(type==="leadership"){
  const cases=[
   {q:"Dos tareas urgentes compiten por el mismo recurso. ¿Qué hacés primero?",opts:["Comparo impacto y plazo, consulto al equipo y explico la prioridad.","Asigno el recurso a la tarea más sencilla para terminar rápido.","Decido sin compartir el criterio para evitar discusiones.","Espero a que otro integrante resuelva el conflicto."],ok:0},
   {q:"Un informe importante contiene un dato que contradice dos registros anteriores.",opts:["Verifico el origen, documento la discrepancia y solicito confirmación.","Reemplazo los registros anteriores por el informe nuevo.","Ignoro el dato para no retrasar el trabajo.","Promedio los valores aunque midan cosas distintas."],ok:0},
   {q:"Un integrante cumple su tarea, pero el resto del equipo queda retrasado.",opts:["Reviso el cuello de botella y redistribuyo tareas sin perder responsabilidades.","Le asigno todas las tareas pendientes al mismo integrante.","Mantengo el reparto aunque ya no funcione.","Cancelo el trabajo del equipo sin revisar alternativas."],ok:0},
   {q:"La información disponible no alcanza para tomar una decisión segura.",opts:["Identifico qué falta, pido datos y comunico qué decisión puede esperar.","Completo los datos con una suposición razonable.","Elijo la opción más rápida y no registro la incertidumbre.","Transfiero toda la responsabilidad a otra persona."],ok:0}
  ][level];
  const task=heading("LIDERAZGO","Evaluación de criterio",cases.q);
  choices(task,cases.opts,cases.opts[cases.ok],"Criterio de liderazgo","Liderazgo");
 }
}
function addChoice(box,value,fn){let b=document.createElement("button");b.className="choice";b.textContent=value;b.onclick=fn;box.appendChild(b)}
function finish(box,correct,name,skill){box.querySelectorAll("button").forEach(b=>b.disabled=true);if(correct){const gained=({easy:15,normal:20,hard:25,special:30})[selectedDifficulty]||15;award(name,gained,skill);box.insertAdjacentHTML("beforeend",`<p class="feedback">✓ PRUEBA SUPERADA · +${gained} XP</p>`)}else{box.insertAdjacentHTML("beforeend",'<p class="feedback">Prueba no superada. Podés intentarlo nuevamente.</p>')}let again=document.createElement("button");again.className="secondary";again.textContent="VOLVER A ENTRENAMIENTO";again.onclick=()=>{box.innerHTML='<span class="eyebrow">SALA DE PRUEBAS</span><h3>Seleccioná una actividad</h3><p class="muted">Tus resultados se registrarán en tu expediente.</p>'};box.appendChild(again)}



const operationSteps=[
{title:"1 · ORGANIZAR LA ASISTENCIA",text:"Llegan suministros para varias localidades. ¿Cómo organizás el trabajo?",choices:[
{label:"Distribuir tareas según las capacidades y revisar prioridades con el equipo.",score:2,feedback:"El equipo se organiza y cada persona sabe qué hacer."},
{label:"Repartir todo rápidamente sin comprobar las necesidades.",score:0,feedback:"La distribución avanza, pero algunos recursos podrían no ser los adecuados."},
{label:"Esperar instrucciones para cada detalle.",score:1,feedback:"Se evitan errores, aunque se pierde tiempo de coordinación."}]},
{title:"2 · INFORMACIÓN INCOMPLETA",text:"Dos informes tienen datos diferentes sobre las necesidades de una localidad. ¿Qué hacés?",choices:[
{label:"Comparar las fuentes y pedir confirmación antes de actualizar el registro.",score:2,feedback:"La información queda verificada y el equipo evita confusiones."},
{label:"Elegir el primer informe recibido.",score:0,feedback:"La decisión es rápida, pero se basa en datos no confirmados."},
{label:"Compartir ambos informes como si fueran definitivos.",score:1,feedback:"El equipo conoce la diferencia, aunque todavía falta verificarla."}]},
{title:"3 · CIERRE DE LA MISIÓN",text:"Una compañera está sobrecargada y queda una tarea de registro pendiente. ¿Cómo resolvés la situación?",choices:[
{label:"Redistribuir la tarea y consultar si alguien necesita apoyo.",score:2,feedback:"El equipo termina coordinado y con responsabilidades equilibradas."},
{label:"Pedirle que termine todo por su cuenta.",score:0,feedback:"La tarea se completa, pero el equipo queda desbalanceado."},
{label:"Dejar el registro para otro día sin avisar.",score:0,feedback:"Queda información importante sin documentar."}]}
];
let operationChoice=0,operationScore=0;
function renderOperations(){
 $("operation-history").innerHTML=state.operations.length?state.operations.slice().reverse().map(o=>`<p>✓ ${o.name} · ${o.grade} · +${o.xp} XP <span class="muted">· ${o.date}</span></p>`).join(""):"Todavía no completaste ninguna operación.";
 const done=state.operations.some(o=>o.id==="first-destination");
 $("operation-status").textContent=done?"Operación completada":"Esperando asignación";
 $("operation-summary").textContent=done?"La primera misión ya figura en tu expediente. Próximamente habrá nuevas operaciones.":"Revisá el informe y prepará a tu equipo.";
 $("begin-operation").textContent=done?"OPERACIÓN COMPLETADA":"INICIAR OPERACIÓN →";
 $("begin-operation").disabled=done||!state.teamConfirmed;
 $("begin-operation").onclick=beginOperation;
}
function beginOperation(){
 if(!state.teamConfirmed){showPage("equipo");return}
 if(state.operations.some(o=>o.id==="first-destination"))return;
 operationChoice=0;operationScore=0;
 showOperationStep();
}
function showOperationStep(){
 const step=operationSteps[operationChoice];
 $("operation-status").textContent="Operación en curso · Etapa "+(operationChoice+1)+"/3";
 $("operation-summary").textContent="Equipo asignado: "+state.team.map(id=>candidates.find(c=>c.id===id)?.name).join(", ");
 $("operation-content").innerHTML=`<div class="operation-progress"><span style="width:${(operationChoice/3)*100}%"></span></div><h3>${step.title}</h3><p>${step.text}</p><div class="operation-choices">${step.choices.map((c,i)=>`<button class="operation-choice" data-operation-choice="${i}">${c.label}</button>`).join("")}</div><p class="operation-feedback" id="operation-feedback"></p>`;
 document.querySelectorAll("[data-operation-choice]").forEach(b=>b.onclick=()=>chooseOperation(Number(b.dataset.operationChoice)));
}
function chooseOperation(index){
 const step=operationSteps[operationChoice],choice=step.choices[index];
 operationScore+=choice.score;
 document.querySelectorAll("[data-operation-choice]").forEach(b=>b.disabled=true);
 $("operation-feedback").textContent=choice.feedback;
 const next=document.createElement("button");next.className="primary";next.textContent=operationChoice===2?"FINALIZAR OPERACIÓN →":"CONTINUAR →";next.onclick=()=>{operationChoice++;if(operationChoice<3)showOperationStep();else completeOperation()};$("operation-content").appendChild(next);
}
function completeOperation(){
 const xp=operationScore>=5?30:operationScore>=3?20:15;
 const grade=operationScore>=5?"DESTACADA":operationScore>=3?"SATISFACTORIA":"CON OBSERVACIONES";
 state.operations.push({id:"first-destination",name:"PRIMER DESTINO",grade,xp,date:campaignDate()});
 award("Operación: Primer destino",xp,"Liderazgo");
 $("operation-status").textContent="MISIÓN COMPLETADA · "+grade;
 $("operation-summary").textContent="La asistencia quedó organizada y el informe fue entregado. El desempeño de tu equipo quedó registrado.";
 $("operation-content").innerHTML=`<div class="operation-result"><span>RESULTADO FINAL</span><strong>${grade}</strong><b>+${xp} XP</b><p>${operationScore}/6 puntos de coordinación.</p><p>${state.team.map(id=>candidates.find(c=>c.id===id)?.name).join(" · ")} completaron su primera misión con vos.</p></div><button class="secondary" id="return-operations">VOLVER AL CENTRO DE OPERACIONES</button>`;
 $("return-operations").onclick=renderOperations;renderOperations();
}


function enterGame(){ $("lobby").hidden=true;$("game-app").hidden=false;showPage(state.teamConfirmed?"inicio":"equipo");window.scrollTo({top:0,behavior:"smooth"}); }
$("new-game").addEventListener("click",()=>{if(localStorage.getItem("recluta-save")&&!confirm("¿Empezar una partida nueva? El progreso local actual se reemplazará."))return;state={xp:0,level:1,completed:0,skills:{Disciplina:1,Resistencia:1,Inteligencia:1,Coordinación:1,Liderazgo:1},history:[],team:[],teamConfirmed:false,campaignMonth:0,campaignLog:[],operations:[],operationProgress:null};selectedTeam=[];save();enterGame()});
$("continue-game").addEventListener("click",enterGame);
const lobbyDetailData={
partidas:["ARCHIVO DE PARTIDAS","Mis partidas",()=>`<div class="detail-stat-grid"><div><b>${state.teamConfirmed?"ACTIVA":"SIN INICIAR"}</b><small>Estado de carrera</small></div><div><b>${campaignDate()}</b><small>Período actual</small></div><div><b>NIVEL ${state.level}</b><small>${state.xp} XP acumulados en el nivel</small></div></div><p>Tu partida se guarda automáticamente en este navegador. Para jugar en otro dispositivo necesitaremos implementar exportación o cuentas con servidor.</p><button class="detail-action" id="detail-continue">ABRIR MI PARTIDA →</button>`],
logros:["REGISTRO DE MÉRITOS","Logros",()=>`<div class="detail-list"><div><b>${state.completed>0?"✓":"○"} Primeros pasos</b><span>Completá tu primera prueba · ${state.completed>0?"Desbloqueado":"Pendiente"}</span></div><div><b>${state.teamConfirmed?"✓":"○"} Trabajo en equipo</b><span>Confirmá tu equipo · ${state.teamConfirmed?"Desbloqueado":"Pendiente"}</span></div><div><b>${state.level>=5?"✓":"○"} Carrera en ascenso</b><span>Alcanzá el nivel 5 · ${state.level>=5?"Desbloqueado":"Pendiente"}</span></div></div><p>Los reconocimientos se desbloquean jugando. No hace falta conectarse todos los días.</p>`],
historial:["REGISTRO DE ACTIVIDAD","Historial",()=>state.history.length?`<div class="detail-list">${state.history.slice().reverse().map((x,i)=>`<div><b>${x.name}</b><span>+${x.xp} XP · ${x.date}</span></div>`).join("")}</div>`:`<p>Todavía no hay actividades registradas. Cuando completes una prueba, aparecerá acá.</p>`],
ayuda:["GUÍA DE INGRESO","Manual del cadete",()=>`<div class="detail-list"><div><b>01 · Formá tu equipo</b><span>Elegí tres compañeros entre los cinco aspirantes.</span></div><div><b>02 · Entrená</b><span>Completá desafíos de memoria, logística, lógica, coordinación y liderazgo.</span></div><div><b>03 · Progresá</b><span>Ganás experiencia y mejorás tus aptitudes.</span></div><div><b>04 · Avanzá la campaña</b><span>El calendario avanza cuando vos pulsás el botón. No hay penalización por descansar.</span></div></div>`],
planes:["INFORMACIÓN DEL PROYECTO","Planes futuros",()=>`<p>RECLUTA está en desarrollo y actualmente se puede jugar gratis. La posibilidad de ofrecer planes para sostener el proyecto es una idea futura, todavía sin cobros ni suscripciones activas.</p><p>Antes de cualquier pago habrá información clara sobre precios, condiciones y conservación de partidas.</p>`],
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
