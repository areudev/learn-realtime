document.addEventListener('DOMContentLoaded', () => {
  const chat = document.getElementById('chat')
  const msgs = document.getElementById('msgs')
  const indicator = document.getElementById('presence-indicator')

  const INTERVAL = 3000
  const BACKOFF_FACTOR = 2
  let nextRequestTime = 0
  let failedTries = 0
  let allChat = []

  const startChatApp = () => {
    hideElement(indicator)
    addSubmitEventListener(chat)
    requestAnimationFrame(rafTimer)
  }

  const hideElement = (element) => {
    element.style.display = 'none'
  }

  const addSubmitEventListener = (formElement) => {
    formElement.addEventListener('submit', handleFormSubmit)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    const {user, text} = event.target.elements
    postNewMsg(user.value, text.value)
    text.value = ''
  }

  const postNewMsg = async (user, text) => {
    const data = {user, text}
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }

    try {
      await fetch('/poll', options)
    } catch (error) {
      console.error('Error posting message:', error)
    }
  }

  const getNewMsgs = async () => {
    try {
      const res = await fetch('/poll')
      if (res.status >= 400) {
        throw new Error('Request failed: ' + res.status)
      }
      const json = await res.json()
      allChat = json.messages
      render()
      failedTries = 0
    } catch (error) {
      console.error('Error fetching messages:', error)
      failedTries++
    }
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

  const rafTimer = async (time) => {
    if (time > nextRequestTime) {
      await getNewMsgs()
      nextRequestTime = time + INTERVAL * Math.pow(BACKOFF_FACTOR, failedTries)
    }
    requestAnimationFrame(rafTimer)
  }

  startChatApp()
})

// const chat = document.getElementById('chat')
// const msgs = document.getElementById('msgs')
// const indicator = document.getElementById('presence-indicator')

// let allChat = []

// const INTERVAL = 3000

// indicator.style.display = 'none'
// chat.addEventListener('submit', function (e) {
//   e.preventDefault()
//   postNewMsg(chat.elements.user.value, chat.elements.text.value)
//   chat.elements.text.value = ''
// })

// async function postNewMsg(user, text) {
//   const data = {user, text}
//   const options = {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(data),
//   }

//   await fetch('/poll', options)
// }

// let failedTries = 0

// async function getNewMsgs() {
//   let json

//   try {
//     const res = await fetch('/poll')
//     json = await res.json()

//     if (res.status >= 400) {
//       throw new Error('request failed: ' + res.status)
//     }

//     allChat = json.messages
//     render()
//     failedTries = 0
//   } catch (e) {
//     console.error(e)
//     failedTries++
//   }
// }

// function render() {
//   const html = allChat.map(({user, text, time, id}) =>
//     template(user, text, time, id)
//   )
//   msgs.innerHTML = html.join('\n')
// }

// const template = (user, msg) =>
//   `<li class="flex flex-row-reverse p-2 w-96 justify-between border border-slate-400"><span class="text-md text-slate-400">${user}</span>${msg}</li>`

// // getNewMsgs()

// const BACKOFF_FACTOR = 2
// let tikeToMakeNewRequest = 0
// async function rafTimer(time) {
//   if (time > tikeToMakeNewRequest) {
//     console.log('time', time)
//     await getNewMsgs()
//     tikeToMakeNewRequest =
//       time + INTERVAL * Math.pow(BACKOFF_FACTOR, failedTries)
//   }
//   requestAnimationFrame(rafTimer)
// }

// requestAnimationFrame(rafTimer)
