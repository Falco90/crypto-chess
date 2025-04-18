import fs from 'fs';
import path from 'path';

type ContractPath = {
    source: string;
    target?: string;
};

const contractsToExport: ContractPath[] = [
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IJsonApiVerification.sol/IJsonApiVerification.json'},
    { source: '@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol/ContractRegistry.json' },
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol/IFdcHub.json'},
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol/IFdcHub.json'},
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IFlareSystemsManager.sol/IFlareSystemsManager.json'},
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IRelay.sol/IRelay.json'},
    { source: '@flarenetwork/flare-periphery-contracts/coston2/IFdcRequestFeeConfigurations.sol/IFdcRequestFeeConfigurations.json'},
    { source: 'contracts/utils/Helpers.sol/Helpers.json'},
    { source: 'contracts/ChessTournamentImpl.sol/ChessTournamentImpl.json'},

];

const sourceBase = path.join(__dirname, '../artifacts');
const targetBase = path.join(__dirname, '../../server/artifacts');

if (!fs.existsSync(targetBase)) {
    fs.mkdirSync(targetBase, { recursive: true });
}

for (const contract of contractsToExport) {
    const { source, target } = contract;
    const sourcePath = path.join(sourceBase, source);
    const fileName = target || path.basename(source);
    const targetPath = path.join(targetBase, fileName);

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✔ Copied ${source} → ${fileName}`);
}