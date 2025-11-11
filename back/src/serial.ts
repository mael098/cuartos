import { SerialPort, ReadlineParser } from 'serialport'
import { randomUUID } from "node:crypto"

const portName = 'COM4'

export const port = new SerialPort({
    path: portName,
    baudRate: 9600
})

export const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

port.on('error', err => {
    console.error('Error:', err.message)
})

port.on('open', () => {
    console.log(`Conectado al puerto ${portName}`)
})

export function getTemp() {
    const { promise, reject, resolve } = Promise.withResolvers<[number,number,number]>()

    const id = randomUUID()
    port.write(`get_temp:${id}\n`);

    const listener = (chunk: string) => {
        try {
            const data = JSON.parse(chunk)
            if (data.event !== 'get_temp' || data.id !== id) return 

            resolve(data.data)
            parser.removeListener('data', listener)
        } catch (error) {
            console.error('Error parsing data:', error)
            reject(new Error('Failed to get temperature'))
        }        
    }

    parser.on('data', listener)
    setTimeout(() => {
        reject(new Error('Time end'))
        parser.removeListener('data', listener)
    }, 3_000)

    return promise
}