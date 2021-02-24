require('dotenv').config()
const mineflayer = require('mineflayer')

let lasttime = -1
let moving = 0
let connected = 0

const actions = ['forward', 'back', 'left', 'right']
let lastaction

const TIMEOUT = Number(process.env.BOT_RECONNNECT_WAIT) || 5000 // 30000 if authed
const moveinterval = Number(process.env.BOT_MOVE_INTERVAL) || 2
const maxrandom = Number(process.env.BOT_MOVE_MAX_RANDOM) || 5 // 0-5 seconds added to movement interval (randomly)
const options = {
  host: process.env.SERVER_HOST,
  port: Number(process.env.SERVER_PORT),
  username: process.env.BOT_USERNAME
}

let bot = mineflayer.createBot(options)

let isRestarting = 0

function relog (bot) {
  if (isRestarting === 0) {
    isRestarting = 1
    console.log(new Date(), 'Attempting to reconnect...')
    bot = mineflayer.createBot(options)
    bindEvents(bot)
  } else { isRestarting = 0 }
}

function bindEvents (bot) {
  bot.on('login', function () {
    console.log(new Date(), 'I logged in.')
    console.log(new Date(), 'settings', JSON.stringify(bot.settings))
    isRestarting = 0
  })

  bot.on('time', function () {
    if (connected < 1) {
      return
    }
    if (lasttime < 0) {
      lasttime = bot.time.age
    } else {
      const randomadd = Math.random() * maxrandom * 20
      const interval = moveinterval * 20 + randomadd
      if (bot.time.age - lasttime > interval) {
        if (moving === 1) {
          console.log(new Date(), 'stop moving')
          bot.setControlState(lastaction, false)
          moving = 0
          lasttime = bot.time.age
        } else {
          console.log(new Date(), 'start moving')
          const yaw = Math.random() * Math.PI - (0.5 * Math.PI)
          const pitch = Math.random() * Math.PI - (0.5 * Math.PI)
          bot.look(yaw, pitch, false)
          lastaction = actions[Math.floor(Math.random() * actions.length)]
          bot.setControlState(lastaction, true)
          moving = 1
          lasttime = bot.time.age
          bot.activateItem()
        }
      }
    }
  })

  bot.on('spawn', function () {
    connected = 1
  })

  bot.on('kicked', function (reason) {
    console.log(new Date(), 'I got kicked for', reason, 'lol')
    setTimeout(relog, TIMEOUT)
  })

  bot.on('error', function (err) {
    console.log(new Date(), 'Error attempting to reconnect: ' + err.errno + '.')
    if (!err.code) {
      console.log(new Date(), 'Invalid credentials OR bot needs to wait because it relogged too quickly.')
      console.log(new Date(), 'Will retry to connect in 30 seconds. ')
      setTimeout(relog, TIMEOUT)
    }
  })

  bot.on('end', function () {
    console.log(new Date(), 'Bot has ended')
    setTimeout(relog, TIMEOUT)
  })
}

bindEvents(bot)
