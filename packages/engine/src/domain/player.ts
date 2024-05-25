export const asPlayerKey = (id: number) => {
  return ['player', id].join('-');
};
// tailwindcss class name in safelist
export const COLOR_CLASS_BY_PLAYER = {
  ...(Object.fromEntries(
    ['cyan-500', 'red-500', 'green-500'].map((color, i) => [
      asPlayerKey(i + 1),
      color,
    ]),
  ) as Record<string, string>),
  default: 'orange-100',
};
