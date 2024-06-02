import { Action, ActionType } from './action';

import { LABEL_BY_TILE_RESOURCE, TileResource } from '@repo/engine';

export type LogEvent = {
  action: Action;
};

export const formatCost = (costByResourceType?: Record<string, number>) => {
  if (!costByResourceType) {
    return '';
  }

  // TODO move to ui jsx render side
  const cost = Object.keys(costByResourceType)
    .map((type: string) => {
      return LABEL_BY_TILE_RESOURCE[type] + '-' + costByResourceType[type];
    })
    .join(' ');

  return `Cost ${cost}`;
};

const FORMATTER_BY_BUILD_TYPE = {
  [ActionType.Build]: (log: LogEvent) => {
    const { i, j, payload, playerKey, costByResourceType } = log.action;
    const { owner, building } = payload;
    return `Player ${playerKey} built ${building} [${i}, ${j}] | ${formatCost(costByResourceType)}`;
  },
  [ActionType.Nuclear]: (log: LogEvent) => {
    const { i, j, payload, playerKey, costByResourceType } = log.action;
    console.log('owner', log.action);
    const { owner } = payload;
    return `Player ${playerKey} Nuke [${i}, ${j}] of ${owner} | ${formatCost(costByResourceType)}`;
  },
  [ActionType.Research]: (log: LogEvent) => {
    const { payload, playerKey, costByResourceType } = log.action;
    const { n } = payload;
    return `Player ${playerKey} research PrimeGPT-${n} | ${formatCost(costByResourceType)}`;
  },
  [ActionType.Noop]: (log: LogEvent) => {},
};

export const mapLogAsMessage = (log: LogEvent) => {
  let message = '';
  if (!log?.action?.type) {
    return message;
  }
  const logFormatter = FORMATTER_BY_BUILD_TYPE[log?.action?.type];

  message = logFormatter(log) || '';
  console.log(message);
  return message;
};
