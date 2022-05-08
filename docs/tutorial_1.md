# tutorial 1

```bash 
# lanciare una node repl 
node                        

# dalla console node o dallo stesso terminale 
let modules = await import('./src/tutorial_1.js')

# i simboli esportati si trovano nell'oggetto modules 
modules 
```

## creare i nodi 
Il sorgente del tutorial espone il modulo `Ipfs` e altre utilities. 

Per creare un nodo possiamo usare il metodo statico `create` del modulo. 

```javascript
await Ipfs.create({
        // repo -> directory on FS or IndexedDB
        repo: 'nome-repo',
        config: {
            Bootstrap: ['<bootstrap node>'],
            Addresses: {
              Swarm: ['<swarm address>']
            }
        }
    }
```
Il metodo accetta come input un oggetto di opzioni che permettono di configurare il nodo. La chiave `config` è documentata in questo link https://github.com/ipfs/js-ipfs/blob/master/docs/CONFIG.md

La funzione `getNodes()` definita in questo sorgente permette di instanziare 3 nodi configurati in modo diverso. Possiamo utilizzare questi nodi per testare la loro connettività

```javascript 
let nodes = await modules.getNodes();
```

logghiamo alcune informazioni sui nodi, in particolare la `peerId` e la lista dei `multiaddress` dello `Swarm`

```javascript
Promise.all(nodes.map((node) => node.id())).
  then((ids) => ids.map((id) => console.log(id.id, id.addresses.map((add) => add.toString())))).
  catch((e) => console.log(e));
```
possiamo usare l'api `swarm` per recuperare la lista dei nodi con cui ciascun nodo è connesso 

```javascript
// nodo0 swarm nel network pubblico, espone ip
await nodes[0].swarm.peers();
// nodo1 swarm solo in locale
await nodes[1].swarm.peers();
// nodo2 swarm sul signaling server 
// può contattare i nodi che vivono sul browser, non espone il proprio ip, ok
await nodes[2].swarm.peers();
```

## creare e condividere `DAG nodes`
Il file system distribuito `IPFS` ci permette di manipolare direttamente
[Merkle DAGs](https://docs.ipfs.io/concepts/merkle-dag/#further-resources). 

Ogni `dag` node è identificato in modo univico dal suo `CID` che dipende in mosso essenziale dal payload del nodo e degli eventuali parenti del nodo.

Al momento solo `node0` e `node1` sono in grado di comunicare attraverso il network locale (see config).

Creiamo un `dag` con `node0` 

```javascript 
const node0 = nodes[0];
var messageCID = await node0.dag.put({
    payload: "punk",
    id: await node0.id().then((x) => x.id)
});
```
> le `API` `dag` 
> https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/DAG.md 
> ci permettono di definire un `dag node` come un oggetto javascript 

> `messageCID` è un oggetto `CID` che può essere convertito in una stringa attraverso il suo metodo `toString()` 
> una stringa valida rappresentante un `CID` può essere convertita nell'oggetto `CID` attraverso il metodo `parse` del modulo `CID` del modulo `Ipfs` ...
> `modules.Ipfs.CID.parse(messageCID.toString())`


Abbiamo creato un `dag node` con un payload e una chiave che riporta la `peerId` di `node0`.

Ora proviamo ad usare la nostra chiave privata per firmare il nostro `dag` e certificarlo.

La `peerId` instanziata si trova nel nodo `libp2p` 

```javascript
// recuperiamo la peerId
const id0 = node0.libp2p.peerId;
// trasformiamola in un JSON
const JSONid0 = id0.toJSON();
// conserviamo solo le informazioni pubbliche
const identity0 = { 
  id: JSONid0.id, 
  pubKey: JSONid0.pubKey 
};
// creiamo un buffer a partire dal cid per poterlo firmare
// nel browser utilizzare TextEncoder
// eg new TextEncoder().encode(messageCID.toString())
var data = Buffer.from(messageCID.toString());

// firma 
// utilizziamo il metodo sign della chiave privata 
// accetta come input un buffer contenente i dati che si vogliono firmare

var signature = await id0.privKey.sign(data).then((x)=> Buffer.from(x).toString('hex'));

// il metodo restituisce un buffer che abbiamo convertito in hex

```

Ora che abbiamo la nostra firma creiamo un envelope per il nostro messaggio 

```javascript
var envelopeCID = await node0.dag.put({ 
  message: messageCID,
  signature: signature,
  identity: identity0 
});
```
`envelopeCID` è un `CID` che punta ad un altro `CID`. I `dag` però possono essere attraversati facilmente 

```javascript 
await node0.dag.get(envelopeCID);
// possiamo risolvere direttamente il messaggio
await node0.dag.get(envelopeCID, {path: "message"});
// o il payload
await node0.dag.get(envelopeCID, {path: "message/payload"});
```

Ora proviamo a recuperare il `dag` da `node1`

```javascript 
const node1 = nodes[1];
await node1.dag.get(envelopeCID);
// you might get a warning at this point - no panic :)
// https://github.com/libp2p/js-libp2p/issues/900
```

se è tutto occhei, allora `node1` è riuscito a recuperare il `dag` a cui punta il `envelopeCID`. 

`node0` ha creato un envelope per ceritificare la sua volontà di voler condividere proprio quel `CID`, firmandolo. 

```javascript
envelopeCID.toString();
```

per essere sicuri che sia proprio così, `node1` può verificare la firma ricostruendo l'identità di `node0` a partire dalla sua `pubKey`

```javascript
// recuperiamo identità dal dag
var tmpId = await node1.dag.get(envelopeCID, {path: "identity"}).then((x) => x.value);

// creiamo una peerId a partire dalla identità pubblica
var verifier = await modules.Ipfs.PeerId.createFromJSON(tmpId);
```
potete verificare che la `peerId` creata è esattamente quella di `node0` al netto del fatto che, ovviamente, manca la chiave privata. 

Possiamo però usare la chiave pubblica per verificare che la firma sia valida.


```javascript
// recuperiamo messaggeCID
var targetCID = await node0.dag.
    get(envelopeCID).
    then((data) => data.value.message);

// utilizziamo il metodo verify della chiave pubblica
// accetta come input il buffer dati originale 
// e il buffer della firma da verificare

try {
  let isVerified = await verifier.pubKey.verify(
    Buffer.from(targetCID.toString()),
    Buffer.from(signature, 'hex'))
} catch (error) {
  console.error(error);
}

console.log(isVerified);
```

> **true?** Hope so ...



