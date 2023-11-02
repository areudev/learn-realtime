const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')
const presence = document.getElementById('presence-indicator')
let allChat = []

const socket = io('http://localhost:6969')

socket.on('connect', () => {
  console.log('connected')
  presence.innerText = '🟢'
})

socket.on('disconnect', () => {
  presence.innerText = '🔴'
})

socket.on('msg:get', (data) => {
  allChat = data.msg
  render()
})

chat.addEventListener('submit', function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ''
})

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  }
  socket.emit('msg:post', data)
}

function render() {
  const html = allChat.map(({user, text}) => template(user, text))
  msgs.innerHTML = html.join('\n')
}

const template = (user, msg) =>
  `<li class="flex flex-row-reverse p-2 w-96 justify-between border border-slate-400"><span class="text-md text-slate-400">${user}</span>${msg}</li>`
