import { Action, ActionType } from './action';

export type LogEvent = {
  action: Action;
};

const FORMATTER_BY_BUILD_TYPE = {
  [ActionType.Build]: (log: LogEvent) => {
    const { i, j, payload } = log.action;
    const { owner, building } = payload;
    return `Player ${owner} built ${building} [${i}, ${j}]`;
  },
  [ActionType.Research]: (log: LogEvent) => {
    const { payload } = log.action;
    const { playerKey, n } = payload;
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
