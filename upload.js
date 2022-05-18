const buildDir = "./dist"

const { create, globSource } = require('ipfs-http-client')

// const IPFS_DIRECTORY_MIMETYPE = 'application/x-directory'
const IPFS_ENDPOINT = 'https://ipfs.infura.io:5001'


// const readJson = async (fn) => {
//   return JSON.parse(await fs.promises.readFile(fn))
// }
// const writeJSON = (data, filepath) => {
//     fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
// }

async function uploadBuild() {
  const ipfs = create(IPFS_ENDPOINT)
  let directory
  let n = 0
  console.log('Storing build directory: ' + buildDir)
  for await (const result of ipfs.addAll(globSource(buildDir, '**/*'), { wrapWithDirectory: true })) {
      if (result.path === '') {
        directory = result.cid
      } else {
        console.log(`${++n}:${result.cid}`)
      }
    }
    console.log({ directory })
    if (directory) {
      console.log(`ipfs://${directory}/`)
      console.log(`https://cloudflare-ipfs.com/ipfs/${directory}/`)
    } else {
      console.error('Upload build directory failed!')
      process.exit(1)
    }
}

uploadBuild()