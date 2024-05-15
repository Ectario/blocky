var SHA256 = require("crypto-js/sha256");

class BlockChain {
    constructor(){
        this.blocks = [];
    }
    addBlock(data){
        if(data instanceof Block) { this.blocks.push(data); }
        else { // just a data
            var lastHash = this.blocks[this.blocks.length - 1].hash;
            var newBlock = new Block(data, lastHash);
            this.addBlock(newBlock);
        }
    }
    static InitBlockChain(){
        var genesisBlock = Block.Genesis();
        var newBlockChain = new BlockChain();
        newBlockChain.addBlock(genesisBlock);
        return newBlockChain;
    }
}

class Block {
    hash;
    data;
    prevHash;

    constructor(data, prevHash){
        this.data = data;
        this.prevHash = prevHash;
        this.deriveHash();
    }

    deriveHash() {
        var info = this.data + this.prevHash;
        var hash = SHA256(info);
        this.hash = hash;
        return hash;
    }
    static Genesis(){
        return new Block("Genesis", "");
    }
}

function printBlockChain(chain){
    for (const block in chain.blocks) {
        console.log(`Block ${block} :`);
        console.log(`          Data     - ${chain.blocks[block].data}`);
        console.log(`          Hash     - ${chain.blocks[block].hash}`);
        console.log(`          PrevHash - ${chain.blocks[block].prevHash}`);
    }
}

function main(projectName) {
    console.log(projectName + " says hello!");
    chain = BlockChain.InitBlockChain();
    
    chain.addBlock("first block after genesis");
    chain.addBlock("second block after genesis");
    chain.addBlock("third block after genesis");

    printBlockChain(chain);
    
}

main("Blocky");