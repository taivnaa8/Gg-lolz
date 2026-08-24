function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let chosenDatetime = "";
let chosenPlace = "";

// ---- no button shrink game ----
let noCount = 0;
const noStates = [
  { text: "Гуйжин авчих л даа 🥹🥺", noClass: "shrink-1" },
  { text: "Гомдчихлооо 😭",            noClass: "shrink-2" }
];

document.getElementById('btn-yes').addEventListener('click', () => {
  spawnHearts();
  showScreen('screen-yes-react');
});

document.getElementById('btn-no').addEventListener('click', () => {
  noCount++;
  const btnYes = document.getElementById('btn-yes');
  const btnNo  = document.getElementById('btn-no');
  if (noCount >= noStates.length){
    btnNo.textContent = noStates[noStates.length - 1].text;
    btnNo.classList.remove('shrink-1');
    btnNo.classList.add('shrink-2');
    btnNo.disabled = true;
    btnNo.style.opacity = '0.4';
    btnNo.style.cursor = 'default';
    return;
  }
  const state = noStates[noCount - 1];
  btnNo.textContent = state.text;
  btnNo.classList.remove('shrink-1','shrink-2');
  btnNo.classList.add(state.noClass);
  btnYes.classList.add('grow');
});

document.getElementById('btn-continue').addEventListener('click', () => showScreen('screen-cards'));

// spawn floating hearts on yes screen
function spawnHearts(){
  const emojis = ['❤️','🩷','💗','💕','🌸'];
  for(let i = 0; i < 20; i++){
    setTimeout(() => {
      const h = document.createElement('span');
      h.className = 'yes-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.bottom = '0';
      h.style.animationDuration = (2 + Math.random() * 2) + 's';
      h.style.animationDelay = (Math.random() * 1.5) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 5000);
    }, i * 80);
  }
}

// main menu navigation
document.querySelectorAll('.card[data-target]').forEach(card => {
  card.addEventListener('click', () => showScreen(card.dataset.target));
});
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => showScreen('screen-cards'));
});

// seal animation
document.getElementById('seal').addEventListener('click', () => {
  document.getElementById('seal').style.transform = 'scale(1.15) rotate(8deg)';
});

// date intro -> date card
document.getElementById('btn-date-yes').addEventListener('click', () => showScreen('screen-datetime-choice'));

// date card -> place card
document.getElementById('btn-to-place').addEventListener('click', () => {
  const dateVal = document.getElementById('date-input').value;
  const timeVal = document.getElementById('time-input').value;
  if (!dateVal || !timeVal){
    alert('Өдөр болон цагаа сонгоно уу гүнжтэн минь! 🙂');
    return;
  }
  const dateObj = new Date(dateVal + 'T' + timeVal);
  const formatted = dateObj.toLocaleDateString('mn-MN', { day:'numeric', month:'long' }) + ', ' + timeVal + ' цагт';
  chosenDatetime = formatted;
  showScreen('screen-place-choice');
});

// back from place -> date card
document.querySelectorAll('[data-back-datetime]').forEach(btn => {
  btn.addEventListener('click', () => showScreen('screen-datetime-choice'));
});

// place preset options
const placeData = {
  "cafe":  "☕ Кофе шоп",
  "park":  "🌳 Цэцэрлэгт хүрээлэн",
  "movie": "🎬 Кино театр"
};
document.querySelectorAll('.place-choice').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.place-option').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    chosenPlace = placeData[card.dataset.place];
    setTimeout(() => finishFlow(), 300);
  });
});

// place own write
document.getElementById('place-own-confirm').addEventListener('click', () => {
  const answer = document.getElementById('place-own-input').value.trim();
  if (!answer){ alert('Бичээд батлана уу гүнжтэн минь!🙂'); return; }
  chosenPlace = answer;
  finishFlow();
});

function finishFlow(){
  document.getElementById('final-datetime').textContent = chosenDatetime;
  document.getElementById('final-place').textContent = chosenPlace;
  showScreen('screen-final-reveal');
}

// falling petals
const petalContainer = document.getElementById('petals');
const petalEmojis = ['🌸','💗','🌷'];
for (let i = 0; i < 18; i++){
  const p = document.createElement('span');
  p.className = 'petal';
  p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (6 + Math.random() * 6) + 's';
  p.style.animationDelay = (Math.random() * 6) + 's';
  petalContainer.appendChild(p);
}
// Call this function when she clicks her response button
function sendResponse(answer) {
  fetch('https://formspree.io/f/xbgrevok', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      response: answer,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Хариу амжилттай илгээгдлээ! Баярлалаа хайрт минь🥰❤️🙆‍♂️!');
      // Show her your thank you / love message on screen here
    }
  })
  .catch(error => console.error('Error:', error));
}