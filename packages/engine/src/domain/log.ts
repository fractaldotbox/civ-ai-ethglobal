import { Action, ActionType } from './action';

export type LogEvent = {
  action: Action;
};

const FORMATTER_BY_BUILD_TYPE = {
  [ActionType.Build]: (log: LogEvent) => {
    const { i, j, payload, playerKey } = log.action;
    const { owner, building } = payload;
    return `Player ${playerKey} built ${building} [${i}, ${j}]`;
  },
  [ActionType.Nuclear]: (log: LogEvent) => {
    const { i, j, payload, playerKey } = log.action;
    const { owner } = payload;
    return `Player ${playerKey} Nuke [${i}, ${j}]`;
  },
  [ActionType.Research]: (log: LogEvent) => {
    const { payload, playerKey } = log.action;
    const { n } = payload;
    return `Player ${playerKey} research PrimeGPT-${n}`;
  },
};

export const mapLogAsMessage = (log: LogEvent) => {
  let message = '';

  const logFormatter = FORMATTER_BY_BUILD_TYPE[log.action.type];

  message = logFormatter(log);
  console.log(message);
  return message;
};
