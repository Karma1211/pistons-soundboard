export type Category = 'hype' | 'effects' | 'legends' | 'anthems' | 'mine' | 'favorites';
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
  { id: 'favorites', label: 'FAVORITES', emoji: '⭐' },
  { id: 'hype', label: 'HYPE', emoji: '🔥' },
  { id: 'effects', label: 'FX', emoji: '⚡' },
  { id: 'legends', label: 'LEGENDS', emoji: '🏆' },
  { id: 'anthems', label: 'ANTHEMS', emoji: '🎵' },
  { id: 'mine', label: 'MY SOUNDS', emoji: '➕' },
];

export const SOUNDS: Sound[] = [
  // HYPE
  { id: 'deetroit-basketball', label: 'DEETROIT BASKETBALL', file: 'deetroit-basketball.mp3', category: 'hype', color: 'red', subtitle: 'The Classic Call' },
  { id: 'deetroit-basketball-sb', label: 'DEETROIT (ALT)', file: 'deetroit-basketball-sb.mp3', category: 'hype', color: 'blue', subtitle: 'Alternate Cut' },
  { id: 'lets-go-pistons', label: "LET'S GO PISTONS", file: 'lets-go-pistons.mp3', category: 'hype', color: 'blue', subtitle: 'Game 7 Crowd' },
  { id: 'bad-boys', label: 'BAD BOYS', file: 'bad-boys.mp3', category: 'hype', color: 'red', subtitle: 'Inner Circle Anthem' },
  { id: 'player-intros', label: 'PLAYER INTROS', file: 'player-intros.mp3', category: 'hype', color: 'blue', subtitle: 'John Mason PA Calls' },
  { id: 'final-countdown', label: 'FINAL COUNTDOWN', file: 'final-countdown.mp3', category: 'hype', color: 'red', subtitle: 'Europa' },
  { id: 'for-life', label: 'FOR LIFE', file: 'for-life.mp3', category: 'hype', color: 'blue', subtitle: 'Pistons Rally' },
  { id: 'yes-sir', label: 'YES SIR!', file: 'yes-sir.mp3', category: 'hype', color: 'red', subtitle: 'Rip Hamilton' },
  { id: 'yessir-2', label: 'YESSIR', file: 'yessir-2.mp3', category: 'hype', color: 'gold', subtitle: 'Short Cut' },
  { id: 'real-men-of-genius', label: 'REAL MEN OF GENIUS', file: 'real-men-of-genius.mp3', category: 'hype', color: 'blue', subtitle: 'Bud Light Pistons' },

  // EFFECTS
  { id: 'buzzer', label: 'GAME BUZZER', file: 'buzzer.mp3', category: 'effects', color: 'red', subtitle: 'End of Game' },
  { id: 'air-horn', label: 'AIR HORN', file: 'air-horn.mp3', category: 'effects', color: 'blue', subtitle: 'Arena Horn' },
  { id: 'crowd-roar', label: 'CROWD ROAR', file: 'crowd-roar.mp3', category: 'effects', color: 'red', subtitle: 'Big Play Energy' },
  { id: 'cannon', label: 'CANNON SHOT', file: 'cannon.mp3', category: 'effects', color: 'gold', subtitle: 'Pistons Cannon' },
  { id: 'shot-clock', label: 'SHOT CLOCK', file: 'shot-clock.mp3', category: 'effects', color: 'blue', subtitle: '24-Second Buzz' },
  { id: 'crowd-cheer', label: 'CROWD CHEER', file: 'crowd-cheer.mp3', category: 'effects', color: 'red', subtitle: '5-Second Blast' },
  { id: 'pistons-work-whistle', label: 'WORK WHISTLE', file: 'pistons-work-whistle.mp3', category: 'effects', color: 'blue', subtitle: 'Arena Whistle' },
  { id: 'shaq-foul', label: 'SHAQ FOUL', file: 'shaq-foul.mp3', category: 'effects', color: 'gold', subtitle: 'Classic Foul Call' },

  // LEGENDS
  { id: 'john-mason', label: 'JOHN MASON', file: 'john-mason.mp3', category: 'legends', color: 'red', subtitle: 'PA Announcer' },
  { id: 'rasheed', label: "BALL DON'T LIE", file: 'rasheed.mp3', category: 'legends', color: 'blue', subtitle: 'Rasheed Wallace' },
  { id: 'chauncey-billups', label: 'CHAUNCEY BILLUPS', file: 'chauncey-billups.mp3', category: 'legends', color: 'red', subtitle: 'Mr. Big Shot' },
  { id: 'billups-1', label: 'BILLUPS CLIP 1', file: 'billups-1.mp3', category: 'legends', color: 'blue', subtitle: 'Chauncey' },
  { id: 'billups-2', label: 'BILLUPS CLIP 2', file: 'billups-2.mp3', category: 'legends', color: 'red', subtitle: 'Chauncey' },
  { id: 'billups-3', label: 'BILLUPS CLIP 3', file: 'billups-3.mp3', category: 'legends', color: 'blue', subtitle: 'Chauncey' },
  { id: 'billups-mason', label: 'BILLUPS-MASON', file: 'billups-mason.mp3', category: 'legends', color: 'gold', subtitle: 'Classic Exchange' },
  { id: 'tayshaun-1', label: 'TAYSHAUN 1', file: 'tayshaun-1.mp3', category: 'legends', color: 'red', subtitle: 'Tayshaun Prince' },
  { id: 'tayshaun-2', label: 'TAYSHAUN 2', file: 'tayshaun-2.mp3', category: 'legends', color: 'blue', subtitle: 'Tayshaun Prince' },
  { id: 'tayshaun-3', label: 'TAYSHAUN 3', file: 'tayshaun-3.mp3', category: 'legends', color: 'red', subtitle: 'Tayshaun Prince' },
  { id: 'tayshaun-4', label: 'TAYSHAUN 4', file: 'tayshaun-4.mp3', category: 'legends', color: 'gold', subtitle: 'Tayshaun Prince' },
  { id: 'kid-chauncey', label: 'KID: CHAUNCEY', file: 'kid-chauncey.mp3', category: 'legends', color: 'blue', subtitle: 'Kid Announcer' },
  { id: 'kid-tayshaun', label: 'KID: TAYSHAUN', file: 'kid-tayshaun.mp3', category: 'legends', color: 'red', subtitle: 'Kid Announcer' },
  { id: 'kid-michigan', label: 'STATE OF MICHIGAN', file: 'kid-michigan.mp3', category: 'legends', color: 'gold', subtitle: 'Kid Announcer' },

  // ANTHEMS
  { id: 'pump-it-up', label: 'PUMP IT UP PISTONS', file: 'pump-it-up-pistons.mp3', category: 'anthems', color: 'red', subtitle: '1990 Classic' },
  { id: 'emergency-radio-spot', label: 'EMERGENCY RADIO', file: 'emergency-radio-spot.mp3', category: 'anthems', color: 'red', subtitle: 'Bud Light Spot' },
  { id: 'yodeler-radio-spot', label: 'YODELER', file: 'yodeler-radio-spot.mp3', category: 'anthems', color: 'blue', subtitle: 'Bud Light Spot' },
  { id: 'monk-radio-spot', label: 'MONK RADIO', file: 'monk-radio-spot.mp3', category: 'anthems', color: 'gold', subtitle: 'Bud Light Spot' },
  { id: 'opera-radio-spot', label: 'OPERA RADIO', file: 'opera-radio-spot.mp3', category: 'anthems', color: 'red', subtitle: 'Bud Light Spot' },
  { id: 'flip-saunders-1', label: 'FLIP SAUNDERS 1', file: 'flip-saunders-1.mp3', category: 'anthems', color: 'blue', subtitle: 'Coach Flip' },
  { id: 'flip-saunders-2', label: 'FLIP SAUNDERS 2', file: 'flip-saunders-2.mp3', category: 'anthems', color: 'red', subtitle: 'Coach Flip' },
  { id: 'flip-saunders-3', label: 'FLIP SAUNDERS 3', file: 'flip-saunders-3.mp3', category: 'anthems', color: 'blue', subtitle: 'Coach Flip' },

  // MY SOUNDS
  { id: 'fahhh', label: 'FAHHHH!', file: 'fahhh.mp3', category: 'mine', color: 'red', subtitle: 'Crowd Reaction' },
  { id: 'deetroit-v2', label: 'DEETROIT V2', file: 'deetroit-v2.mp3', category: 'mine', color: 'blue', subtitle: 'Alternate Cut' },
];
