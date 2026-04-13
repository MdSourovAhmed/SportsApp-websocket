// Central registry for all supported sports.
// Add a new sport here and the entire app adapts automatically.

// export const SPORTS = {
//   football: {
//     label: "Football",
//     emoji: "⚽",
//     color: "#22c55e",
//     accent: "#16a34a",
//     scoreLabel: ["Home", "Away"],
//     scoreUnit: "goals",
//     periods: ["First Half", "Half Time", "Second Half", "Extra Time", "Penalties"],
//     defaultPeriod: "First Half",
//     minuteLabel: "min",
//     maxMinute: 120,
//     eventTypes: [
//       { value: "goal",         label: "Goal",           icon: "⚽", color: "#22c55e" },
//       { value: "yellow_card",  label: "Yellow Card",    icon: "🟨", color: "#eab308" },
//       { value: "red_card",     label: "Red Card",       icon: "🟥", color: "#ef4444" },
//       { value: "substitution", label: "Substitution",   icon: "🔄", color: "#6366f1" },
//       { value: "penalty",      label: "Penalty",        icon: "🎯", color: "#f97316" },
//       { value: "var",          label: "VAR Review",     icon: "📺", color: "#8b5cf6" },
//       { value: "offside",      label: "Offside",        icon: "🚩", color: "#f59e0b" },
//       { value: "corner",       label: "Corner",         icon: "📐", color: "#0ea5e9" },
//       { value: "foul",         label: "Foul",           icon: "✋", color: "#94a3b8" },
//       { value: "injury",       label: "Injury",         icon: "🩹", color: "#fb7185" },
//       { value: "kickoff",      label: "Kick Off",       icon: "🏁", color: "#a3e635" },
//       { value: "fulltime",     label: "Full Time",      icon: "🔔", color: "#fbbf24" },
//       { value: "commentary",   label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home} - ${away}`,
//     statsTemplate: ["Possession", "Shots", "Shots on Target", "Corners", "Fouls", "Yellow Cards", "Red Cards"],
//   },

//   cricket: {
//     label: "Cricket",
//     emoji: "🏏",
//     color: "#f59e0b",
//     accent: "#d97706",
//     scoreLabel: ["Batting", "Bowling"],
//     scoreUnit: "runs",
//     periods: ["1st Innings", "2nd Innings", "3rd Innings", "4th Innings", "Super Over"],
//     defaultPeriod: "1st Innings",
//     minuteLabel: "over",
//     maxMinute: 50,
//     eventTypes: [
//       { value: "six",         label: "Six",            icon: "6️⃣", color: "#22c55e" },
//       { value: "four",        label: "Four",           icon: "4️⃣", color: "#3b82f6" },
//       { value: "wicket",      label: "Wicket",         icon: "🎯", color: "#ef4444" },
//       { value: "wide",        label: "Wide",           icon: "↔️", color: "#f59e0b" },
//       { value: "no_ball",     label: "No Ball",        icon: "🚫", color: "#f97316" },
//       { value: "run_out",     label: "Run Out",        icon: "🏃", color: "#8b5cf6" },
//       { value: "catch",       label: "Catch",          icon: "🤲", color: "#06b6d4" },
//       { value: "lbw",         label: "LBW",            icon: "🦵", color: "#ec4899" },
//       { value: "review",      label: "DRS Review",     icon: "📺", color: "#a855f7" },
//       { value: "fifty",       label: "Fifty",          icon: "🌟", color: "#fbbf24" },
//       { value: "century",     label: "Century",        icon: "💯", color: "#fbbf24" },
//       { value: "over_end",    label: "Over Complete",  icon: "🔔", color: "#94a3b8" },
//       { value: "innings_end", label: "Innings End",    icon: "🏁", color: "#64748b" },
//       { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home}/${away}`, // runs/wickets display
//     statsTemplate: ["Run Rate", "Extras", "Boundaries", "Sixes", "Wickets", "Overs"],
//   },

//   badminton: {
//     label: "Badminton",
//     emoji: "🏸",
//     color: "#06b6d4",
//     accent: "#0891b2",
//     scoreLabel: ["Player 1", "Player 2"],
//     scoreUnit: "points",
//     periods: ["Game 1", "Game 2", "Game 3"],
//     defaultPeriod: "Game 1",
//     minuteLabel: "rally",
//     maxMinute: 150,
//     eventTypes: [
//       { value: "point",       label: "Point",          icon: "✅", color: "#22c55e" },
//       { value: "ace",         label: "Ace",            icon: "⚡", color: "#fbbf24" },
//       { value: "net",         label: "Net Fault",      icon: "🔴", color: "#ef4444" },
//       { value: "out",         label: "Out",            icon: "❌", color: "#f97316" },
//       { value: "service",     label: "Service",        icon: "🏸", color: "#06b6d4" },
//       { value: "game_point",  label: "Game Point",     icon: "🎯", color: "#8b5cf6" },
//       { value: "match_point", label: "Match Point",    icon: "🏆", color: "#f59e0b" },
//       { value: "injury",      label: "Injury Break",   icon: "🩹", color: "#fb7185" },
//       { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home} - ${away}`,
//     statsTemplate: ["Aces", "Smashes", "Net Points", "Rally Length", "Errors"],
//   },

//   basketball: {
//     label: "Basketball",
//     emoji: "🏀",
//     color: "#f97316",
//     accent: "#ea580c",
//     scoreLabel: ["Home", "Away"],
//     scoreUnit: "points",
//     periods: ["Q1", "Q2", "Q3", "Q4", "OT"],
//     defaultPeriod: "Q1",
//     minuteLabel: "min",
//     maxMinute: 48,
//     eventTypes: [
//       { value: "two_pointer",   label: "2 Points",      icon: "🏀", color: "#f97316" },
//       { value: "three_pointer", label: "3 Points",      icon: "🎯", color: "#22c55e" },
//       { value: "free_throw",    label: "Free Throw",    icon: "🔵", color: "#3b82f6" },
//       { value: "foul",          label: "Foul",          icon: "✋", color: "#eab308" },
//       { value: "technical",     label: "Technical Foul",icon: "🟥", color: "#ef4444" },
//       { value: "timeout",       label: "Timeout",       icon: "⏱️", color: "#8b5cf6" },
//       { value: "block",         label: "Block",         icon: "🛡️", color: "#06b6d4" },
//       { value: "steal",         label: "Steal",         icon: "⚡", color: "#fbbf24" },
//       { value: "substitution",  label: "Substitution",  icon: "🔄", color: "#6366f1" },
//       { value: "commentary",    label: "Commentary",    icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home} - ${away}`,
//     statsTemplate: ["Field Goals %", "3-Pointers", "Free Throws", "Rebounds", "Assists", "Turnovers", "Steals"],
//   },

//   tennis: {
//     label: "Tennis",
//     emoji: "🎾",
//     color: "#84cc16",
//     accent: "#65a30d",
//     scoreLabel: ["Player 1", "Player 2"],
//     scoreUnit: "games",
//     periods: ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"],
//     defaultPeriod: "Set 1",
//     minuteLabel: "game",
//     maxMinute: 300,
//     eventTypes: [
//       { value: "ace",         label: "Ace",            icon: "⚡", color: "#fbbf24" },
//       { value: "double_fault",label: "Double Fault",   icon: "❌", color: "#ef4444" },
//       { value: "break",       label: "Break",          icon: "💥", color: "#f97316" },
//       { value: "hold",        label: "Hold",           icon: "✅", color: "#22c55e" },
//       { value: "set_point",   label: "Set Point",      icon: "🎯", color: "#8b5cf6" },
//       { value: "match_point", label: "Match Point",    icon: "🏆", color: "#f59e0b" },
//       { value: "tiebreak",    label: "Tiebreak",       icon: "⚖️", color: "#06b6d4" },
//       { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home} - ${away}`,
//     statsTemplate: ["Aces", "Double Faults", "1st Serve %", "Break Points", "Winners", "Unforced Errors"],
//   },

//   volleyball: {
//     label: "Volleyball",
//     emoji: "🏐",
//     color: "#ec4899",
//     accent: "#db2777",
//     scoreLabel: ["Home", "Away"],
//     scoreUnit: "points",
//     periods: ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"],
//     defaultPeriod: "Set 1",
//     minuteLabel: "rally",
//     maxMinute: 200,
//     eventTypes: [
//       { value: "point",       label: "Point",          icon: "✅", color: "#22c55e" },
//       { value: "ace",         label: "Ace Serve",      icon: "⚡", color: "#fbbf24" },
//       { value: "spike",       label: "Spike",          icon: "💥", color: "#f97316" },
//       { value: "block",       label: "Block",          icon: "🛡️", color: "#3b82f6" },
//       { value: "set_point",   label: "Set Point",      icon: "🎯", color: "#8b5cf6" },
//       { value: "timeout",     label: "Timeout",        icon: "⏱️", color: "#94a3b8" },
//       { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
//     ],
//     winCondition: (home, away) =>
//       home > away ? "home" : away > home ? "away" : "draw",
//     formatScore: (home, away) => `${home} - ${away}`,
//     statsTemplate: ["Aces", "Spikes", "Blocks", "Errors", "Digs"],
//   },
// };

// export const getSport = (key) => SPORTS[key?.toLowerCase()] ?? {
//   label: key ?? "Unknown",
//   emoji: "🏅",
//   color: "#6366f1",
//   accent: "#4f46e5",
//   scoreLabel: ["Home", "Away"],
//   scoreUnit: "points",
//   periods: ["Period 1", "Period 2"],
//   defaultPeriod: "Period 1",
//   minuteLabel: "min",
//   maxMinute: 90,
//   eventTypes: [
//     { value: "point",      label: "Point",      icon: "✅", color: "#22c55e" },
//     { value: "commentary", label: "Commentary", icon: "🎙️", color: "#94a3b8" },
//   ],
//   winCondition: (home, away) =>
//     home > away ? "home" : away > home ? "away" : "draw",
//   formatScore: (home, away) => `${home} - ${away}`,
//   statsTemplate: [],
// };

// export const getEventType = (sport, eventValue) => {
//   const config = getSport(sport);
//   return config.eventTypes.find(e => e.value === eventValue) ?? {
//     value: eventValue,
//     label: eventValue,
//     icon: "🎙️",
//     color: "#94a3b8",
//   };
// };

// export const ALL_SPORT_KEYS = Object.keys(SPORTS);




// Central registry for all supported sports.
// Add a new sport here and the entire app adapts automatically.

export const SPORTS = {
  football: {
    label: "Football",
    emoji: "⚽",
    color: "#22c55e",
    accent: "#16a34a",
    scoreLabel: ["Home", "Away"],
    scoreUnit: "goals",
    periods: ["First Half", "Half Time", "Second Half", "Extra Time", "Penalties"],
    defaultPeriod: "First Half",
    minuteLabel: "min",
    maxMinute: 120,
    eventTypes: [
      { value: "goal",         label: "Goal",           icon: "⚽", color: "#22c55e" },
      { value: "yellow_card",  label: "Yellow Card",    icon: "🟨", color: "#eab308" },
      { value: "red_card",     label: "Red Card",       icon: "🟥", color: "#ef4444" },
      { value: "substitution", label: "Substitution",   icon: "🔄", color: "#6366f1" },
      { value: "penalty",      label: "Penalty",        icon: "🎯", color: "#f97316" },
      { value: "var",          label: "VAR Review",     icon: "📺", color: "#8b5cf6" },
      { value: "offside",      label: "Offside",        icon: "🚩", color: "#f59e0b" },
      { value: "corner",       label: "Corner",         icon: "📐", color: "#0ea5e9" },
      { value: "foul",         label: "Foul",           icon: "✋", color: "#94a3b8" },
      { value: "injury",       label: "Injury",         icon: "🩹", color: "#fb7185" },
      { value: "kickoff",      label: "Kick Off",       icon: "🏁", color: "#a3e635" },
      { value: "fulltime",     label: "Full Time",      icon: "🔔", color: "#fbbf24" },
      { value: "commentary",   label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home} - ${away}`,
    statsTemplate: ["Possession", "Shots", "Shots on Target", "Corners", "Fouls", "Yellow Cards", "Red Cards"],
  },

  cricket: {
    label: "Cricket",
    emoji: "🏏",
    color: "#f59e0b",
    accent: "#d97706",
    scoreLabel: ["Batting", "Bowling"],
    scoreUnit: "runs",
    periods: ["1st Innings", "2nd Innings", "3rd Innings", "4th Innings", "Super Over"],
    defaultPeriod: "1st Innings",
    minuteLabel: "over",
    maxMinute: 50,
    eventTypes: [
      { value: "six",         label: "Six",            icon: "6️⃣", color: "#22c55e" },
      { value: "four",        label: "Four",           icon: "4️⃣", color: "#3b82f6" },
      { value: "wicket",      label: "Wicket",         icon: "🎯", color: "#ef4444" },
      { value: "wide",        label: "Wide",           icon: "↔️", color: "#f59e0b" },
      { value: "no_ball",     label: "No Ball",        icon: "🚫", color: "#f97316" },
      { value: "run_out",     label: "Run Out",        icon: "🏃", color: "#8b5cf6" },
      { value: "catch",       label: "Catch",          icon: "🤲", color: "#06b6d4" },
      { value: "lbw",         label: "LBW",            icon: "🦵", color: "#ec4899" },
      { value: "review",      label: "DRS Review",     icon: "📺", color: "#a855f7" },
      { value: "fifty",       label: "Fifty",          icon: "🌟", color: "#fbbf24" },
      { value: "century",     label: "Century",        icon: "💯", color: "#fbbf24" },
      { value: "over_end",    label: "Over Complete",  icon: "🔔", color: "#94a3b8" },
      { value: "innings_end", label: "Innings End",    icon: "🏁", color: "#64748b" },
      { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home}/${away}`, // runs/wickets display
    statsTemplate: ["Run Rate", "Extras", "Boundaries", "Sixes", "Wickets", "Overs"],
  },

  badminton: {
    label: "Badminton",
    emoji: "🏸",
    color: "#06b6d4",
    accent: "#0891b2",
    scoreLabel: ["Player 1", "Player 2"],
    scoreUnit: "points",
    periods: ["Game 1", "Game 2", "Game 3"],
    defaultPeriod: "Game 1",
    minuteLabel: "rally",
    maxMinute: 150,
    eventTypes: [
      { value: "point",       label: "Point",          icon: "✅", color: "#22c55e" },
      { value: "ace",         label: "Ace",            icon: "⚡", color: "#fbbf24" },
      { value: "net",         label: "Net Fault",      icon: "🔴", color: "#ef4444" },
      { value: "out",         label: "Out",            icon: "❌", color: "#f97316" },
      { value: "service",     label: "Service",        icon: "🏸", color: "#06b6d4" },
      { value: "game_point",  label: "Game Point",     icon: "🎯", color: "#8b5cf6" },
      { value: "match_point", label: "Match Point",    icon: "🏆", color: "#f59e0b" },
      { value: "injury",      label: "Injury Break",   icon: "🩹", color: "#fb7185" },
      { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home} - ${away}`,
    statsTemplate: ["Aces", "Smashes", "Net Points", "Rally Length", "Errors"],
  },

  basketball: {
    label: "Basketball",
    emoji: "🏀",
    color: "#f97316",
    accent: "#ea580c",
    scoreLabel: ["Home", "Away"],
    scoreUnit: "points",
    periods: ["Q1", "Q2", "Q3", "Q4", "OT"],
    defaultPeriod: "Q1",
    minuteLabel: "min",
    maxMinute: 48,
    eventTypes: [
      { value: "two_pointer",   label: "2 Points",      icon: "🏀", color: "#f97316" },
      { value: "three_pointer", label: "3 Points",      icon: "🎯", color: "#22c55e" },
      { value: "free_throw",    label: "Free Throw",    icon: "🔵", color: "#3b82f6" },
      { value: "foul",          label: "Foul",          icon: "✋", color: "#eab308" },
      { value: "technical",     label: "Technical Foul",icon: "🟥", color: "#ef4444" },
      { value: "timeout",       label: "Timeout",       icon: "⏱️", color: "#8b5cf6" },
      { value: "block",         label: "Block",         icon: "🛡️", color: "#06b6d4" },
      { value: "steal",         label: "Steal",         icon: "⚡", color: "#fbbf24" },
      { value: "substitution",  label: "Substitution",  icon: "🔄", color: "#6366f1" },
      { value: "commentary",    label: "Commentary",    icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home} - ${away}`,
    statsTemplate: ["Field Goals %", "3-Pointers", "Free Throws", "Rebounds", "Assists", "Turnovers", "Steals"],
  },

  tennis: {
    label: "Tennis",
    emoji: "🎾",
    color: "#84cc16",
    accent: "#65a30d",
    scoreLabel: ["Player 1", "Player 2"],
    scoreUnit: "games",
    periods: ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"],
    defaultPeriod: "Set 1",
    minuteLabel: "game",
    maxMinute: 300,
    eventTypes: [
      { value: "ace",         label: "Ace",            icon: "⚡", color: "#fbbf24" },
      { value: "double_fault",label: "Double Fault",   icon: "❌", color: "#ef4444" },
      { value: "break",       label: "Break",          icon: "💥", color: "#f97316" },
      { value: "hold",        label: "Hold",           icon: "✅", color: "#22c55e" },
      { value: "set_point",   label: "Set Point",      icon: "🎯", color: "#8b5cf6" },
      { value: "match_point", label: "Match Point",    icon: "🏆", color: "#f59e0b" },
      { value: "tiebreak",    label: "Tiebreak",       icon: "⚖️", color: "#06b6d4" },
      { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home} - ${away}`,
    statsTemplate: ["Aces", "Double Faults", "1st Serve %", "Break Points", "Winners", "Unforced Errors"],
  },

  volleyball: {
    label: "Volleyball",
    emoji: "🏐",
    color: "#ec4899",
    accent: "#db2777",
    scoreLabel: ["Home", "Away"],
    scoreUnit: "points",
    periods: ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"],
    defaultPeriod: "Set 1",
    minuteLabel: "rally",
    maxMinute: 200,
    eventTypes: [
      { value: "point",       label: "Point",          icon: "✅", color: "#22c55e" },
      { value: "ace",         label: "Ace Serve",      icon: "⚡", color: "#fbbf24" },
      { value: "spike",       label: "Spike",          icon: "💥", color: "#f97316" },
      { value: "block",       label: "Block",          icon: "🛡️", color: "#3b82f6" },
      { value: "set_point",   label: "Set Point",      icon: "🎯", color: "#8b5cf6" },
      { value: "timeout",     label: "Timeout",        icon: "⏱️", color: "#94a3b8" },
      { value: "commentary",  label: "Commentary",     icon: "🎙️", color: "#94a3b8" },
    ],
    winCondition: (home, away) =>
      home > away ? "home" : away > home ? "away" : "draw",
    formatScore: (home, away) => `${home} - ${away}`,
    statsTemplate: ["Aces", "Spikes", "Blocks", "Errors", "Digs"],
  },
};

export const getSport = (key) => SPORTS[key?.toLowerCase()] ?? {
  label: key ?? "Unknown",
  emoji: "🏅",
  color: "#6366f1",
  accent: "#4f46e5",
  scoreLabel: ["Home", "Away"],
  scoreUnit: "points",
  periods: ["Period 1", "Period 2"],
  defaultPeriod: "Period 1",
  minuteLabel: "min",
  maxMinute: 90,
  eventTypes: [
    { value: "point",      label: "Point",      icon: "✅", color: "#22c55e" },
    { value: "commentary", label: "Commentary", icon: "🎙️", color: "#94a3b8" },
  ],
  winCondition: (home, away) =>
    home > away ? "home" : away > home ? "away" : "draw",
  formatScore: (home, away) => `${home} - ${away}`,
  statsTemplate: [],
};

export const getEventType = (sport, eventValue) => {
  const config = getSport(sport);
  return config.eventTypes.find(e => e.value === eventValue) ?? {
    value: eventValue,
    label: eventValue,
    icon: "🎙️",
    color: "#94a3b8",
  };
};

export const ALL_SPORT_KEYS = Object.keys(SPORTS);