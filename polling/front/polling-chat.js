const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')

let allChat = []

const INTERVAL = 3000

chat.addEventListener('submit', function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ''
})

async function postNewMsg(user, text) {}

async function getNewMsgs() {}

function render() {
  const html = allChat.map(({user, text, time, id}) =>
    template(user, text, time, id)
  )
  msgs.innerHTML = html.join('\n')
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`

// make the first request
getNewMsgs()
