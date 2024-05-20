export function printBlockChain(chain){
    for (const block in chain.blocks) {
        console.log(`Block ${block} :`);
        console.log(`          Data     - ${chain.blocks[block].data}`);
        console.log(`          Hash     - ${chain.blocks[block].hash}`);
        console.log(`          PrevHash - ${chain.blocks[block].prevHash}`);
    }
}