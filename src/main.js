import { BlockChain } from './blockchain/blockchain.js';
import { printBlockChain } from './utils/infos.js';

function main(projectName) {
    console.log(projectName + " says hello!");
    const chain = BlockChain.InitBlockChain();
    
    chain.addBlock("first block after genesis");
    chain.addBlock("second block after genesis");
    chain.addBlock("third block after genesis");

    printBlockChain(chain);
    
}

main("Blocky");