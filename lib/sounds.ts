export type Category = 'hype' | 'effects' | 'legends' | 'anthems';
export type ColorVariant = 'red' | 'blue' | 'gold';

export interface Sound {
  id: string;
  label: string;
  file: string;
  category: Category;
  color: ColorVariant;
  subtitle?: string;
}

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'hype', label: 'HYPE', emoji: '🔥' },
  { id: 'effects', label: 'FX', emoji: '⚡' },
  { id: 'legends', label: 'LEGENDS', emoji: '🏆' },
  { id: 'anthems', label: 'ANTHEMS', emoji: '🎵' },
];

export const SOUNDS: Sound[] = [
  // HYPE
  {
    id: 'deetroit-basketball',
    label: 'DEETROIT BASKETBALL',
    file: 'deetroit-basketball.mp3',
    category: 'hype',
    color: 'red',
    subtitle: 'The Classic Call',
  },
  {
    id: 'lets-go-pistons',
    label: "LET'S GO PISTONS",
    file: 'lets-go-pistons.mp3',
    category: 'hype',
    color: 'blue',
    subtitle: 'Game 7 Crowd',
  },
  {
    id: 'bad-boys',
    label: 'BAD BOYS',
    file: 'bad-boys.mp3',
    category: 'hype',
    color: 'red',
    subtitle: 'Inner Circle Anthem',
  },
  {
    id: 'player-intros',
    label: 'PLAYER INTROS',
    file: 'player-intros.mp3',
    category: 'hype',
    color: 'blue',
    subtitle: 'John Mason PA Calls',
  },
  {
    id: 'final-countdown',
    label: 'FINAL COUNTDOWN',
    file: 'final-countdown.mp3',
    category: 'hype',
    color: 'red',
    subtitle: 'Europa',
  },
  {
    id: 'for-life',
    label: 'FOR LIFE',
    file: 'for-life.mp3',
    category: 'hype',
    color: 'blue',
    subtitle: 'Pistons Rally',
  },

  // EFFECTS
  {
    id: 'buzzer',
    label: 'GAME BUZZER',
    file: 'buzzer.mp3',
    category: 'effects',
    color: 'red',
    subtitle: 'End of Game',
  },
  {
    id: 'air-horn',
    label: 'AIR HORN',
    file: 'air-horn.mp3',
    category: 'effects',
    color: 'blue',
    subtitle: 'Arena Horn',
  },
  {
    id: 'crowd-roar',
    label: 'CROWD ROAR',
    file: 'crowd-roar.mp3',
    category: 'effects',
    color: 'red',
    subtitle: 'Big Play Energy',
  },
  {
    id: 'cannon',
    label: 'CANNON SHOT',
    file: 'cannon.mp3',
    category: 'effects',
    color: 'gold',
    subtitle: 'Pistons Cannon',
  },
  {
    id: 'shot-clock',
    label: 'SHOT CLOCK',
    file: 'shot-clock.mp3',
    category: 'effects',
    color: 'blue',
    subtitle: '24-Second Buzz',
  },
  {
    id: 'crowd-cheer',
    label: 'CROWD CHEER',
    file: 'crowd-cheer.mp3',
    category: 'effects',
    color: 'red',
    subtitle: '5-Second Blast',
  },

  // LEGENDS
  {
    id: 'john-mason',
    label: 'JOHN MASON',
    file: 'john-mason.mp3',
    category: 'legends',
    color: 'red',
    subtitle: 'PA Announcer',
  },
  {
    id: 'rasheed',
    label: 'BALL DON\'T LIE',
    file: 'rasheed.mp3',
    category: 'legends',
    color: 'blue',
    subtitle: 'Rasheed Wallace',
  },
  {
    id: 'chauncey-billups',
    label: 'CHAUNCEY BILLUPS',
    file: 'chauncey-billups.mp3',
    category: 'legends',
    color: 'red',
    subtitle: 'Mr. Big Shot',
  },

  // ANTHEMS
  {
    id: 'pump-it-up',
    label: 'PUMP IT UP PISTONS',
    file: 'pump-it-up-pistons.mp3',
    category: 'anthems',
    color: 'red',
    subtitle: '1990 Classic',
  },
];
