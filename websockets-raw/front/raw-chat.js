const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')
const presence = document.getElementById('presence-indicator')
let allChat = []
console.log('hi!')

chat.addEventListener('submit', function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ''
})

async function postNewMsg(user, text) {}

function render() {
  const html = allChat.map(({user, text}) => template(user, text))
  msgs.innerHTML = html.join('\n')
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`
