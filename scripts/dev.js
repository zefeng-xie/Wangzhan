const { spawn } = require('child_process')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function getSpawnCommand(args) {
  if (process.platform === 'win32') {
    return {
      command: 'cmd.exe',
      commandArgs: ['/d', '/s', '/c', `${npmCommand} ${args.join(' ')}`],
    }
  }

  return {
    command: npmCommand,
    commandArgs: args,
  }
}

function prefixStream(stream, prefix, target) {
  let buffer = ''

  stream.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''

    lines.forEach((line) => {
      if (line.length > 0) {
        target.write(`${prefix} ${line}\n`)
      }
    })
  })

  stream.on('end', () => {
    if (buffer.length > 0) {
      target.write(`${prefix} ${buffer}\n`)
    }
  })
}

function runService(name, color, args) {
  const { command, commandArgs } = getSpawnCommand(args)

  const child = spawn(command, commandArgs, {
    cwd: rootDir,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
  })

  const label = `\x1b[${color}m[${name}]\x1b[0m`
  prefixStream(child.stdout, label, process.stdout)
  prefixStream(child.stderr, label, process.stderr)

  child.on('error', (error) => {
    console.error(`${label} failed to start: ${error.message}`)
  })

  return child
}

const services = [
  runService('backend', '36', ['run', 'dev:backend']),
  runService('frontend', '35', ['run', 'dev:frontend']),
]

let shuttingDown = false

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  services.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGINT')
    }
  })

  setTimeout(() => {
    services.forEach((child) => {
      if (!child.killed) {
        child.kill('SIGTERM')
      }
    })
    process.exit(exitCode)
  }, 500)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

services.forEach((child, index) => {
  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    const name = index === 0 ? 'backend' : 'frontend'

    if (signal) {
      console.log(`[dev] ${name} stopped by signal ${signal}`)
      shutdown(0)
      return
    }

    if (code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`)
      shutdown(code ?? 1)
      return
    }

    console.log(`[dev] ${name} exited normally`)
    shutdown(0)
  })
})

console.log('[dev] Starting frontend and backend...')
