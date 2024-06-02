const cells = [
  {
    'id': '87411cba2ffffff',
    'name': 'Tai Po District',
  },
  {
    'id': '874ba016dffffff',
    'name': 'Longtan District, TW',
  },
  {
    'id': '874bb10a1ffffff',
    'name': 'Lingya District, TW',
  },
  {
    'id': '874ba0b5affffff',
    'name': 'Wugu District, TW',
  },
  {
    'id': '8765b5646ffffff',
    'name': 'Ward 11, VN',
  },
  {
    'id': '87658a9a1ffffff',
    'name': 'Phawa, TH',
  },
  {
    'id': '8764266c0ffffff',
    'name': 'Kathu, TH',
  },
  {
    'id': '876526addffffff',
    'name': 'Singapore, SG',
  },
  {
    'id': '87681b993ffffff',
    'name': 'Semporna, MY',
  },
  {
    'id': '87a726c29ffffff',
    'name': 'City of Melville, AU',
  }
];

export const randomCell = () => {
  return cells[Math.floor(Math.random() * cells.length)];
}
