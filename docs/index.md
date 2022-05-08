# PUNK TUTORIAL 

Implementiamo una `DApp` sul protocollo e file system distribuito `IPFS` grazie al suo networking stack `libp2p` e `OrbitDB`.

> - [Ipfs](https://ipfs.io/) è un protocollo e un file system distribuito allacciato a un network `p2p` 
> - [libp2p](https://libp2p.io/) è il networking stack di `Ipfs`, permette ai nodi di stabilire connessioni dirette attraverso diversi possibili trasporti 
> - [OrbitDB](https://orbitdb.org/) è un database serverless, distribuito e p2p per il protocollo `IPFS` 


## feature della app 

Implementiamo una `DApp` che permette di gestire i propri **database distribuiti** e di interagire con i database di altri nodi attraverso un protocollo condiviso. 
Lo stato dell'applicazione è **distribuito** cioè replicato dai nodi connessi in modo **p2p**. 

#### esempio: `social feed` 
Un social feed può essere implementato come una `DApp`. Il feed è un database distribuito che permette al nodo proprietario l'esclusività di pubblicare determinati contenuti mentre permette ad altri nodi di interagire con il database attraverso delle regole definite da un `Access Controller`, una sorta di 'smart contract' in grado di stabilire se un dato può è essere aggiunto al database oppure no. 

## requisiti 

- node js 16 o superiore 
- un editor 
- un browser 
- ...

## riferimenti

quick link alle `API` di riferimento

- [IPFS CORE js API](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api)
- [IPFS Module](https://github.com/ipfs/js-ipfs/blob/master/docs/MODULE.md)
- [Peer Id](https://github.com/libp2p/js-peer-id)
- [Libp2p Crypto](https://github.com/libp2p/js-libp2p-crypto)
- [Libp2p js API](https://github.com/libp2p/js-libp2p/blob/master/doc/API.md#libp2p)
- [OrbitDB API](https://github.com/orbitdb/orbit-db/blob/main/API.md)

## quick dev 

### Node js

```bash 
# lanciare una node repl 
node 

# dalla console node o dallo stesso terminale 
const modules = await import('./src/tutorial0.js')

# i simboli esportati si trovano nell'oggetto modules 
modules 
```

### browser 

lanciare il server per le risorse statiche con il comando 
```bash 
node server.js
```
in un terminale dedicato. visitare http://localhost:8081 e aprire gli strumenti di sviluppo

```
window.IpfsCore
window.OrbitDB
... 
```

> il file `index.html` può essere aperto nel browser direttamente da file system.
> Nel browser i dati vengono salvati nel database IndexedDB e possono essere cancellati attraverso l'interfaccia grafica degli strumenti di sviluppo.
> 

## Intro 
`Ipfs` è un hyper media protocol e un network stack per la condivisione di dati online. Il protocollo `Ipfs` indicizza l'informazione attraverso un codice identificativo univoco chiamato `CID`. Un `CID` è un multihash dell'hash del file che si vuole indicizzare, cioè un hash che parla di sé stesso e permette al protocollo di essere estensibile nel tempo indipendentemente dagli algoritmi di hashing impiegati. 

> `Ipfs` **non è una blockchain** ma un protocollo per accedere a un file system distribuito

Ogni nodo possiede una o più chiavi private che gli permettono di identificarsi e stabilire connessione sicure con altri nodi del network. 

> L'identità di un nodo è una `PeerId`, cioè un multihash della chiave pubblica associata alla chiave privata che permette ad ogni nodo di provare la propria identità agli altri nodi.

`OrbitDB` è un database serverless, distribuito e p2p che utilizza `IPFS` come storage e i canali `pubsub` per replicare i database. `OrbitDB` salva le operazioni di scrittura sul database in una [CFRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#:~:text=In%20distributed%20computing%2C%20a%20conflict,always%20mathematically%20possible%20to%20resolve), una struttura dati che permette ai nodi di aggiungere contenuti ai database in modo asincrono e senza coordinamento preservando però la coerenza dei database stessi.

> l'implementazione della `CFRDT` si trova nel repository `ipfs-log` https://github.com/orbitdb/ipfs-log

I dati aggiunti all'`operation-log` sono controllati da un [Access Controller](https://github.com/orbitdb/orbit-db-access-controllers). Un contenuto si trova nell'`oplog` se e solo il contenuto rispetta le norme stabilite nell'`Access Controller`.


### tutorials 
1. [tutorial 1](./tutorial_1.md), *networking*, *dags*, *peerId*
2. [tutorial 2](./tutorial_2.md), *pubsub*, *chat*, *naife db con pubsub* - work in progress
