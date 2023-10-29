const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')

let allChat = []

const INTERVAL = 3000

chat.addEventListener('submit', function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ''
})

async function postNewMsg(user, text) {
  const data = {user, text}
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  }

  await fetch('/poll', options)
}

async function getNewMsgs() {
  let json
  try {
    const res = await fetch('/poll')
    json = await res.json()
  } catch (e) {
    console.error(e)
  }
  if (json) {
    allChat = json.messages
    console.log(allChat)

    render()
    setTimeout(getNewMsgs, INTERVAL)
  }
}

function render() {
  const html = allChat.map(({user, text, time, id}) =>
    template(user, text, time, id)
  )
  msgs.innerHTML = html.join('\n')
}

const template = (user, msg) =>
  `<li class="flex flex-row-reverse p-2 w-96 justify-between border border-slate-400"><span class="text-md text-slate-400">${user}</span>${msg}</li>`

getNewMsgs()
