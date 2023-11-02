document.addEventListener('DOMContentLoaded', () => {
  const chat = document.getElementById('chat')
  const msgs = document.getElementById('msgs')
  const presence = document.getElementById('presence-indicator')
  console.log(presence)
  let allChat = []
  console.log('hi!')

  chat.addEventListener('submit', function (e) {
    e.preventDefault()
    postNewMsg(chat.elements.user.value, chat.elements.text.value)
    chat.elements.text.value = ''
  })

  async function postNewMsg(user, text) {}

  const ws = new WebSocket('ws://localhost:6969')
  ws.addEventListener('open', () => {
    console.log('connected')
    presence.innerText = '🟢'
  })

  ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data)
    allChat = data.msg
    render()
  })

  console.log(ws)

  function render() {
    const html = allChat.map(({user, text}) => template(user, text))
    msgs.innerHTML = html.join('\n')
  }

  const template = (user, msg) =>
    `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`
})
