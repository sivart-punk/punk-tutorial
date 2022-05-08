const Ipfs = window.IpfsCore

async function getNode(repo) {
    const node = await Ipfs.create({
        repo: repo,
        config: {
            Bootstrap: [],
            Addresses: {
                Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
            }
        }
    })
    return node
}
