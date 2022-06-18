import fs from 'fs'
export default JSON.parse(
  fs.readFileSync(`${process.cwd()}/package.json`).toString()
)
