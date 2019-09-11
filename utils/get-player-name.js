const aliases = {
  'Chris Johnson': 'Chris D. Johnson',
  'Duke Johnson': 'Duke Johnson Jr.',
  'LeVeon Bell': 'Le\'Veon Bell',
  'John Ross III': 'John Ross',
  'Marvin Jones' : 'Marvin Jones Jr.',
  'Mitch Trubisky' : 'Mitchell Trubisky',
  'Odell Beckham' : 'Odell Beckham Jr.',
  'Robert Kelley' : 'Rob Kelley',
  'Steven Hauschka' : 'Stephen Hauschka',
  'Terrelle Pryor Sr.': 'Terrelle Pryor',
  'Willie Snead' : 'Willie Snead IV',
  'Will Lutz' : 'Wil Lutz',
  'Todd Gurley II': 'todd gurley',
  'Melvin Gordon': 'melvin gordon iii',
  'Allen Robinson': 'allen robinson ii',
  'Mark Ingram': 'mark ingram ii',
  'Will Fuller': 'will fuller v',
  'Ronald Jones II': 'ronald jones',
  'DJ Moore': 'D.J. Moore',
  'Paul Richardson': 'Paul Richardson Jr.',
  'DK Metcalf': 'D.K. Metcalf',

  'Baltimore': 'ravens dst',
  'Minnesota': 'vikings dst',
  'Jacksonville': 'jaguars dst',
  'Los Angeles': 'rams dst',
  'Denver Broncos' : 'broncos dst',
  'Seattle Seahawks' : 'seahawks dst',
  'Houston Texans' : 'texans dst',
  'Kansas City Chiefs' : 'chiefs dst',
  'Minnesota Vikings' : 'vikings dst',
  'New England Patriots': 'patriots dst',
  'New York Giants': 'giants dst',
  'Arizona Cardinals': 'cardinals dst',
  'Carolina Panthers': 'panthers dst',
  'Jacksonville Jaguars': 'jaguars dst',
  'Pittsburgh Steelers': 'steelers dst',
  'Los Angeles Rams': 'rams dst',
  'Philadelphia Eagles': 'eagles dst',
  'Baltimore Ravens': 'ravens dst',
  'Tampa Bay Buccaneers': 'buccaneers dst',
  'Los Angeles Chargers': 'chargers dst',
  'Green Bay Packers': 'packers dst',
  'Miami Dolphins': 'dolphins dst',
  'Cincinnati Bengals': 'bengals dst',
  'Atlanta Falcons': 'falcons dst',
  'Oakland Raiders': 'raiders dst',
  'Tennessee Titans': 'titans dst',
  'Washington Redskins': 'redskins dst',
  'Dallas Cowboys': 'cowboys dst',
  'Buffalo Bills': 'bills dst',
  'Chicago Bears': 'bears dst',
  'Indianapolis Colts': 'colts dst',
  'Detroit Lions': 'lions dst',
  'New York Jets': 'jets dst',
  'New Orleans Saints': 'saints dst',
  'Cleveland Browns': 'browns dst',
  'San Francisco 49ers': '49ers dst'
}

const getPlayerName = (name) => {
  name = name.replace('D/ST', 'dst')
  name = aliases[name] || name

  return name.toLowerCase()
}

module.exports = getPlayerName
