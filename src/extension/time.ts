import * as convertUnitToMs from 'milliseconds';
import parseMilliseconds = require('parse-ms');
import { EventEmitter } from 'events';
import { Time } from '../types/Time';

export const formatMilliseconds = (inputMs: number): string => {
  const { days, hours, minutes, seconds, milliseconds } = parseMilliseconds(
    inputMs
  );
  let str = '';
  if (days) {
    str += `${days}d `;
  }
  if (hours) {
    str += `${hours}:`;
  }
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  const tenths = milliseconds < 100 ? 0 : String(milliseconds).charAt(0);
  str += `${paddedMinutes}:${paddedSeconds}.${tenths}`;
  return str;
};

export const createTimeStruct = (milliseconds = 0): Time => {
  const parsedTime = parseMilliseconds(milliseconds);

  return Object.assign({}, parsedTime, {
    formatted: formatMilliseconds(milliseconds),
    raw: milliseconds,
    timestamp: Date.now()
  });
};

export const parseSeconds = (seconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
} => {
  return parseMilliseconds(seconds * 1000);
};

export const parseTimeStringToMs = (timeString: string): number => {
  let ms = 0;
  const timeParts = timeString.split(':').filter(part => part.trim());
  if (timeParts.length === 3) {
    ms += convertUnitToMs.hours(parseInt(timeParts[0], 10));
    ms += convertUnitToMs.minutes(parseInt(timeParts[1], 10));
    ms += convertUnitToMs.seconds(parseFloat(timeParts[2]));
    return ms;
  }
  if (timeParts.length === 2) {
    ms += convertUnitToMs.minutes(parseInt(timeParts[0], 10));
    ms += convertUnitToMs.seconds(parseFloat(timeParts[1]));
    return ms;
  }
  if (timeParts.length === 1) {
    ms += convertUnitToMs.seconds(parseFloat(timeParts[0]));
    return ms;
  }
  throw new Error(`Unexpected format of timeString argument: ${timeString}`);
};

export class CountdownTimer extends EventEmitter {
  interval!: NodeJS.Timeout;
  constructor(endTime: number, tickRate = 100) {
    super();
    this.interval = setInterval(() => {
      const currentTime = Date.now();
      const timeRemaining = Math.max(endTime - currentTime, 0);
      this.emit('tick', createTimeStruct(timeRemaining));
      if (timeRemaining <= 0) {
        this.emit('done');
      }
    }, tickRate);
  }
  stop(): void {
    clearInterval(this.interval);
  }
}
