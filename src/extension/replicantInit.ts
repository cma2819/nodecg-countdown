import { NodeCG } from './nodecg';
import { createTimeStruct } from './time';

export const replicantInit = (nodecg: NodeCG) => {
    nodecg.Replicant('countdown', {
        defaultValue: {
            time: createTimeStruct(0),
            running: false
        }
    });
}
