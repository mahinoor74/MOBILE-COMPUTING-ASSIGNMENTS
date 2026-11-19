const $ = (id) => document.getElementById(id);
document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.module').forEach(m => m.classList.toggle('active', m.id === btn.dataset.target));
  window.scrollTo({top: 0, behavior: 'smooth'});
}));
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const metricHTML = (items) => items.map(([v,l]) => `<div><strong>${v}</strong><small>${l}</small></div>`).join('');

$('signal').addEventListener('input', e => $('signalOut').textContent = e.target.value + '%');
$('runMobility').addEventListener('click', () => {
  const speed = $('mobility').value, signal = +$('signal').value, packets = clamp(+$('packets').value || 100,10,500);
  const speedLoss = {low:2,medium:7,high:16}[speed];
  const lossPct = clamp((100-signal)*0.42 + speedLoss,1,45);
  const delivered = Math.round(packets*(1-lossPct/100));
  const delay = Math.round(28 + (100-signal)*1.05 + {low:8,medium:25,high:58}[speed]);
  const handoffs = {low:1,medium:3,high:6}[speed];
  $('mobilityResults').innerHTML = metricHTML([[`${delivered}/${packets}`,'Delivered'],[`${(packets-delivered)}`,'Packets lost'],[`${delay} ms`,'Avg. delay'],[handoffs,'Handoffs']]);
});
const ipSteps = [
  'The mobile node listens for agent advertisements or sends an agent solicitation to discover available mobility agents.',
  'The visited network provides a Care-of Address (CoA), which represents the mobile node’s current point of attachment.',
  'The mobile node sends a registration request so the Home Agent can associate its permanent home address with the current CoA.',
  'The Home Agent authenticates and accepts the registration, then stores the binding between the home address and CoA.',
  'A packet addressed to the mobile node reaches the Home Agent. The Home Agent encapsulates it and tunnels it toward the CoA.',
  'The Foreign Agent or visited network decapsulates/forwards the packet to the mobile node. Return traffic may follow a different path.'
];
$('showIpStep').addEventListener('click', () => {$('ipOutput').textContent = ipSteps[+$('ipStep').value];});
$('calcApp').addEventListener('click', () => {
  const base=clamp(+$('baseDelay').value||0,1,1000), reg=clamp(+$('regDelay').value||0,0,5000), loss=clamp(+$('lossRate').value||0,0,100);
  const total=base+reg, delivered=Math.round(100*(1-loss/100)), assessment=total<100&&loss<2?'Good':total<250&&loss<8?'Moderate':'Needs improvement';
  $('appResults').innerHTML=metricHTML([[`${total} ms`,'Estimated delay'],[`${delivered}/100`,'Packets delivered'],[assessment,'Assessment']]);
});
function setTopology(changed){
  const wrap=document.querySelector('.route-topology'); wrap.classList.toggle('changed',changed);
  $('topologyStatus').textContent=changed?'Node C moved out of the A–B–C–D path. DSDV must advertise and refresh routes; an alternate route may be selected if available.':'Current illustrative route: A → B → C → D. Routing entries are already maintained.';
  $('dsdvTable').innerHTML=changed?'<tr><td>D</td><td>E</td><td>2</td><td>26</td></tr><tr><td>C</td><td>B</td><td>2</td><td>20</td></tr><tr><td>E</td><td>B</td><td>2</td><td>32</td></tr>':'<tr><td>D</td><td>B</td><td>3</td><td>24</td></tr><tr><td>C</td><td>B</td><td>2</td><td>18</td></tr><tr><td>E</td><td>B</td><td>2</td><td>30</td></tr>';
}
$('topologyBefore').addEventListener('click',()=>setTopology(false));$('topologyAfter').addEventListener('click',()=>setTopology(true));
$('nodes').addEventListener('input',e=>$('nodesOut').textContent=e.target.value+' nodes');
$('compareRouting').addEventListener('click',()=>{
  const n=+$('nodes').value, level=$('change').value, factor={low:1,medium:1.7,high:2.6}[level];
  const dsdvOver=Math.round(n*factor*1.8), aodvOver=Math.round(n*(0.65+factor*0.8));
  const dsdvDelay=Math.round(18+factor*12), aodvDelay=Math.round(25+factor*25);
  const dsdvImpact=level==='high'?'Frequent table updates':'Periodic table updates', aodvImpact=level==='high'?'Repeated route discoveries':'Routes discovered when needed';
  $('routingResults').innerHTML=`<tr><td>Estimated route setup delay</td><td>${dsdvDelay} ms</td><td>${aodvDelay} ms</td></tr><tr><td>Relative control messages (index)</td><td>${dsdvOver}</td><td>${aodvOver}</td></tr><tr><td>Mobility effect</td><td>${dsdvImpact}</td><td>${aodvImpact}</td></tr>`;
  const rec=level==='high'?'AODV can avoid continuous full-table updates, but frequent route discoveries may still raise overhead and delay.':'DSDV can offer low initial route delay because routes are maintained in advance; AODV can reduce idle update traffic by discovering routes on demand.';
  $('routingDecision').textContent=`For ${n} nodes and ${level} topology change: ${rec} These index values are illustrative and are not measured protocol packet counts.`;
});
$('emNodes').addEventListener('input',e=>$('emNodesOut').textContent=e.target.value+' nodes');
$('emLinks').addEventListener('input',e=>$('emLinksOut').textContent=e.target.value+'%');
$('runEmergency').addEventListener('click',()=>{
  const n=+$('emNodes').value, mobility=$('emMobility').value, link=+$('emLinks').value;
  const m={low:0.96,medium:0.88,high:0.74}[mobility];
  const delivery=clamp(Math.round(link*m-(n-5)*0.12),20,99);
  const delay=Math.round(35+n*1.15+{low:8,medium:28,high:65}[mobility]+(100-link)*1.1);
  const overhead=Math.round(n*{low:1.2,medium:2.1,high:3.4}[mobility]);
  const status=delivery>=80?'Stable':delivery>=60?'Degraded':'Unreliable';
  $('emResults').innerHTML=metricHTML([[delivery+'%','Packet delivery'],[delay+' ms','Average delay'],[overhead,'Overhead index'],[status,'Connectivity status']]);
});
