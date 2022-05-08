const Ipfs = require("ipfs")
const wrtc = require('wrtc')
const WStar = require('libp2p-webrtc-star')

console.log('PUNK TUTORIAL 2')

const node0 = async function () {
    const ipfs = await Ipfs.create({
        repo: 'ipfs_data/node0'
    })
    return ipfs
}

const node1 = async function () {

    const ipfs = await Ipfs.create({
        repo: 'ipfs_data/node1',
        config: {
            Bootstrap: [],
            Addresses: {
                Swarm: [
                    '/ip4/127.0.0.9/tcp/4009',
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
            }
        }
    })
    return ipfs
}


async function getNodes() {
    return await Promise.all([node0(), node1()])
}


module.exports = { Ipfs, getNodes }


