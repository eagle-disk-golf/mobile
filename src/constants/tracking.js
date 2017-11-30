export const lane = {
  sessionId: null,
  roundId: null,
  laneId: null,
  throws: [],
  par: 3,
  total_throws: 0,
  start_point: {},
  end_point: {},
  duration: null,
  isActive: false,
  completed: false
}

export const round = {
  lanes: [],
  completed: false,
  roundId: null,
  sessionId: null
}

export const session = {
  rounds: [],
  completed: false,
  sessionId: null,
  name: null
}
