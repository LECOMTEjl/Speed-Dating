window['fileSender'] = async (url, file) => {
    if(!file) return
    return new Promise((resolve, reject) => {
        let fr = new FileReader()
        console.log(file)

        fr.onload = async (ev) => {
            const CHUNK_SIZE = 100000
            const CHUNK_COUNT = ev.target.result.length/CHUNK_SIZE
            const FILE_NAME = file.name

            for(let chunkIndex = 0; chunkIndex < CHUNK_COUNT; chunkIndex++) {
                let CHUNK_START = chunkIndex * CHUNK_SIZE
                let CHUNK_END = CHUNK_START + CHUNK_SIZE
                let CHUNK = ev.target.result.slice(CHUNK_START, CHUNK_END)
                await http.url(url).method('POST').body({ data:CHUNK }).headers({
                    'content-length':CHUNK_SIZE,
                    'content-start':CHUNK_START,
                    'file-name':FILE_NAME
                }).authorization().send()
            }
            await http.url(url).method('POST').body({ end:'ok' }).authorization().send()
            resolve(undefined)
            console.log('Image Sended')
        }

        fr.onerror = (ev) => {
            reject()
        }

        fr.readAsDataURL(file)
    })
}
