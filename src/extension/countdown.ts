import { NodeCG } from "./nodecg";
import { parseTimeString, createTimeStruct, CountdownTimer } from "./time";

let countdownTimer: CountdownTimer;

export const countdown = (nodecg: NodeCG) => {
    const countdownRep = nodecg.Replicant('countdown');

    const logger = new nodecg.Logger("Countdown");

    const start = () => {
        if (!countdownRep.value || countdownRep.value.running || !countdownRep.value.time) {
            return;
        }
        countdownRep.value.running = true;
        if (countdownTimer) {
            countdownTimer.stop();
            countdownTimer.removeAllListeners();
        }
        countdownTimer = new CountdownTimer(
            Date.now() + countdownRep.value.time.raw
        );
        countdownTimer.on("tick", remainingTimeStruct => {
            if (!countdownRep.value) {
                return;
            }
            countdownRep.value.time = remainingTimeStruct;
        });
        logger.info("start");
    };

    const stop = (): void => {
        if (!countdownRep.value || !countdownRep.value.running) {
            return;
        }
        countdownRep.value.running = false;
        if (countdownTimer) {
            countdownTimer.stop();
        }
        logger.info("stop");
    };

    const edit = (editTime: string, cb: any): void => {
        if (!countdownRep.value) {
            return;
        }

        try {
            const durationMs = parseTimeString(editTime);
            stop();
            countdownRep.value.time = createTimeStruct(durationMs);
            logger.info("edit to " + editTime);
        } catch {
            cb("文字列をタイムに変換できません.");
            return;
        }
    };

    nodecg.listenFor('startCountdown', start);
    nodecg.listenFor('stopCountdown', stop);
    nodecg.listenFor('editCountdown', edit);
};
