const fs = require('fs');
const path = require('path');

class ReceiverMannager {
    path
    chunks = ''

    constructor(path) {
        this.path = path
    }

    add(chunk) {
        if(chunk.includes(','))
            chunk = chunk.split(',')?.[1] || chunk
        this.chunks += chunk || ''
    }

    end() {
        let oldPath = this.path
        let split = oldPath.split('.')
        split = split.filter((el,i) => i != split.length - 1)
        let path = split.join('.') + '.png'
        fs.writeFileSync(path, Buffer.from(this.chunks, 'base64'), { flag:'w' })
        this.chunks = ''
    }
}

exports.ReceiverMannager = ReceiverMannager