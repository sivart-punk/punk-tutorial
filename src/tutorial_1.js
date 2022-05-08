const Ipfs = require("ipfs")
const wrtc = require('wrtc')
const WStar = require('libp2p-webrtc-star')

console.log('PUNK TUTORIAL 1')

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
                Swarm: ['/ip4/127.0.0.9/tcp/4009']
            }
        }
    })
    return ipfs
}

const node2 = async function () {
    const ipfs = await Ipfs.create(
        {
            repo: 'ipfs_data/node2',

            config: {
                Bootstrap: [],
                Addresses: {
                    Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
                }
            },

            libp2p: {
                modules: {
                    transport: [WStar]
                },
                config: {
                    peerDiscovery: {
                        webRTCStar: { // <- note the lower-case w - see https://github.com/libp2p/js-libp2p/issues/576
                            enabled: true
                        }
                    },
                    transport: {
                        WebRTCStar: { // <- note the upper-case w- see https://github.com/libp2p/js-libp2p/issues/576
                            wrtc
                        }
                    }
                }
            }
        })
    return ipfs
}

async function getNodes() {
    return await Promise.all([node0(), node1(), node2()])
}

module.exports = { Ipfs, getNodes }



