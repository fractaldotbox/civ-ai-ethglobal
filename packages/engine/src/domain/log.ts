import { Action, ActionType } from './action';

export type LogEvent = {
  action: Action;
};

export const mapLogAsMessage = (log: LogEvent) => {
  let message = '';
  if (log.action.type === ActionType.Build) {
    const { i, j, payload } = log.action;
    // TODO position

    const { owner, building } = payload;
    message = `Player ${owner} built ${building} [${i}, ${j}]`;
  }
  console.log(message);
  return message;
};
