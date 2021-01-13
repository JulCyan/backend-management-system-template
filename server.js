const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const RESOURCE_ROOT_PATH = './src'
const TYPES_ROOT_PATH = './@types'
const API_PATH = RESOURCE_ROOT_PATH + '/api'
const excludesFiles = ['index.ts']
chokidar.watch('./src/api', {
  persistent: true,
  ignored: /(^|[\/\\])\..|index.ts|index.d.ts|node_modules/,
  depth: 4
}).on('all', (event, pathname) => {
  console.log(event, pathname)
  writeDTSFiles(API_PATH)
  success()
})

function writeDTSFiles(DIR_PATH, root) {
  if (!root) {
    root = DIR_PATH
  }
  DIR_PATH = pathFormatter(DIR_PATH)
  root = pathFormatter(root)
  const rootFilenames = fs.readdirSync(DIR_PATH)
  const relativePath = DIR_PATH.replace(root, '')
  // 遍历文件
  rootFilenames.filter(item => !excludesFiles.includes(item)).forEach(function(file) {
    const sourcePath = pathFormatter(path.join(DIR_PATH, `/${file}/`))
    const targetPath = pathFormatter(path.join(TYPES_ROOT_PATH + relativePath, `/${file}/`))
    fs.stat(sourcePath, function(err, stats) {
      if (err) {
        console.log(file + 'is not a directory...')
      } else {
        const isDir = stats.isDirectory()
        if (isDir) {
          // 如果是文件夹则递归执行 writeDTSFiles
          fs.mkdirSync(targetPath, { recursive: true })
          writeDTSFiles(sourcePath, root)
        } else {
          // 不是文件夹时生成对应 .d.ts 文件内容
          let list = getExecStrs(readTSFiles(sourcePath))
          console.log(sourcePath)
          // const data = fs.readFileSync(path.join(sourcePath, file), 'utf-8')
          fs.writeFileSync(`${targetPath.replace('.ts/', '')}.d.ts`, generateDTSData(list))
        }
      }
    })
  })
}

function readTSFiles(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

function pathFormatter(resourcePath) {
  return path.join(resourcePath).replace(/\\/g, '\/')
}

function generateDTSData(data) {
  let firstLine = 'declare module \'@/api\' {' + '\n'
  let endLine = '}' + '\n'
  for (let i = 0; i < data.length; i++) {
    firstLine += '  export const ' + data[i] + ': IRequestFunc' + '\n'
  }
  return firstLine + endLine
}

function getExecStrs(str) {
  var reg = /export const (.+?):/ig
  var list = []
  var result = null
  do {
    result = reg.exec(str)
    result && list.push(result[1])
  } while (result)
  return list
}

function debounce(func, wait) {
  var timeout; return function() {
    var context = this; var args = arguments; clearTimeout(timeout)
    timeout = setTimeout(function() { func.apply(context, args) }, wait)
  }
}

const success = debounce(() => { }, 500)
