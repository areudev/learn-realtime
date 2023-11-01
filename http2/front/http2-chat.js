const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')
const presence = document.getElementById('presence-indicator')

let allChat = []

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

  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  await fetch('/msgs', options)
}

async function getNewMsgs() {
  let reader
  const utf8Decoder = new TextDecoder('utf-8')
  try {
    const res = await fetch('/msgs')
    reader = res.body.getReader()
  } catch (e) {
    console.log('connection error', e)
  }
  let done
  presence.innerHTML = '🟢'
  do {
    let readerResponse
    try {
      readerResponse = await reader.read()
    } catch (e) {
      console.error('read error', e)
      presence.innerHTML = '🔴'
      return
    }

    done = readerResponse.done
    const chunk = utf8Decoder.decode(readerResponse.value, {
      stream: true,
    })
    if (chunk) {
      try {
        const json = JSON.parse(chunk)
        console.log('json', json)
        allChat = json.msg

        render()
      } catch (e) {
        console.error('parse error', e)
      }
    }
    console.log('done', done)
  } while (!done)
  presence.innerHTML = '🔴'
}

const render = () => {
  const html = allChat
    .map(({user, text, time, id}) =>
      createMessageTemplate(user, text, time, id)
    )
    .join('\n')
  msgs.innerHTML = html
}

const createMessageTemplate = (user, msg) => {
  return `<li class="flex flex-row-reverse p-2 w-96 justify-between border border-slate-400"><span class="text-md text-slate-400">${user}</span>${msg}</li>`
}

getNewMsgs()
