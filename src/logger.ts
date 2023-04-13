import { Client, PacketMeta } from 'minecraft-protocol'
const fs = require('fs')
let isFirstDebug = true

export function debug(string: any) {
    if (isFirstDebug) {
        if (process.env.LOG_TO_FILE === 'true') {
            fs.writeFileSync('log.txt', '')
        }
        isFirstDebug = false
    }

    if (process.env.LOG_DEBUG !== 'true') {
        return
    }
    let currentDate = new Date()
    let debugString =
        `[${currentDate.getHours().toString().length === 1 ? `0${currentDate.getHours().toString()}` : currentDate.getHours().toString()}:${
            currentDate.getMinutes().toString().length === 1 ? `0${currentDate.getMinutes().toString()}` : currentDate.getMinutes().toString()
        }:${currentDate.getSeconds().toString().length === 1 ? `0${currentDate.getSeconds().toString()}` : currentDate.getSeconds().toString()}] ` +
        '\x1b[33m[DEBUG] \x1b[36m' +
        JSON.stringify(string)

    if (process.env.LOG_TO_CONSOLE === 'true') {
        console.log(debugString)
    }
    if (process.env.LOG_TO_FILE === 'true') {
        fs.writeFileSync('log.txt', debugString + '\n', { flag: 'a+' })
    }
}

export function logPacket(packet: any, packetMeta: PacketMeta, toServer: boolean) {
    if (process.env.LOG_PACKAGES !== 'true') {
        return
    }
    let hidePackets = [
        'world_particles',
        'entity_teleport',
        'scoreboard_team',
        'keep_alive',
        'transaction',
        'flying',
        'position',
        'look',
        'update_time',
        'entity_velocity',
        'rel_entity_move',
        'entity_metadata',
        'map_chunk',
        'spawn_entity',
        'update_attributes',
        'entity_equipment',
        'named_entity_spawn',
        'scoreboard_objective',
        'animation',
        'player_info',
        'update_sign',
        'tile_entity_data',
        'entity_look',
        'named_sound_effect',
        'update_health',
        'scoreboard_score',
        'scoreboard_display_objective',
        'statistics',
        'respawn',
        'spawn_entity_living',
        'entity_destroy',
        'entity_effect',
        'block_change'
    ]

    if (hidePackets.indexOf(packetMeta.name) !== -1) {
        return
    }
    if (packetMeta.name !== 'window_click' && packetMeta.name !== 'open_window' && packetMeta.name !== 'window_items') {
        return
    }
    if (process.env.LOG_TO_CONSOLE === 'true') {
        console.log('---------------------------------')
        console.log(toServer ? 'toServer' : 'toClient')
        console.log(JSON.stringify(packet))
        console.log(packetMeta)
    }
    if (process.env.LOG_TO_FILE === 'true') {
        fs.writeFileSync('log.txt', '---------------------------------' + '\n', { flag: 'a+' })
        fs.writeFileSync('log.txt', (toServer ? 'toServer' : 'toClient') + '\n', { flag: 'a+' })
        fs.writeFileSync('log.txt', JSON.stringify(packet) + '\n', { flag: 'a+' })
        fs.writeFileSync('log.txt', JSON.stringify(packetMeta) + '\n', { flag: 'a+' })
    }
}

export function logMcChat(string: string) {
    let msg = ''
    let split = string.split('§')
    msg += split[0]
    for (let a of string.split('§').slice(1, split.length)) {
        let color = a.charAt(0)
        let message

        if (Object.keys(colors).includes(color)) {
            msg += colors[color]
        }
        message = a.substring(1, a.length)
        msg += message
    }
    console.log('\x1b[0m\x1b[1m\x1b[90m' + msg + '\x1b[0m')
}

// this function adds a logging function to the wrtie function of the client
// resulting in all sent packets being logged by the logPacket function
export function addLoggerToClientWriteFunction(client: Client) {
    ;(function () {
        var old_prototype = client.write.prototype
        var old_init = client.write
        client.write = function (name, packet) {
            old_init.apply(this, arguments)
            logPacket(packet, { name: name, state: null }, true)
        }
        client.write.prototype = old_prototype
    })()
}

const colors = {
    0: '\x1b[0m\x1b[30m',
    1: '\x1b[0m\x1b[34m',
    2: '\x1b[0m\x1b[32m',
    3: '\x1b[0m\x1b[36m',
    4: '\x1b[0m\x1b[31m',
    5: '\x1b[0m\x1b[35m',
    6: '\x1b[0m\x1b[33m',
    7: '\x1b[0m\x1b[1m\x1b[90m',
    8: '\x1b[0m\x1b[90m',
    9: '\x1b[0m\x1b[34m',
    a: '\x1b[0m\x1b[32m',
    b: '\x1b[0m\x1b[36m',
    c: '\x1b[0m\x1b[31m',
    d: '\x1b[0m\x1b[35m',
    e: '\x1b[0m\x1b[33m',
    f: '\x1b[0m\x1b[37m'
}