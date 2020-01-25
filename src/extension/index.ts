import { NodeCG } from './nodecg';
import { replicantInit } from './replicantInit';
import { countdown } from './countdown';

export = (nodecg: NodeCG): void => {
    replicantInit(nodecg);
    countdown(nodecg);
}