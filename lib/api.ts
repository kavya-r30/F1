export interface Event {
  round: number
  name: string
  event_name: string
  country: string
  location: string
  date: string
  sessions: {
    fp1: string | null
    fp2: string | null
    fp3: string | null
    qualifying: string | null
    sprint: string | null
    race: string | null
  }
}

export interface Driver {
  driver_number: string
  name: string
  abbreviation: string
  team_name: string
  country?: string
  points?: number
  championship_position?: number
}

export interface Team {
  name: string
  drivers: {
    number: string
    name: string
    abbreviation: string
  }[]
  points?: number
  championship_position?: number
  wins?: number
  podiums?: number
}

export interface CircuitInfo {
  name: string
  country: string
  location: string
  track_layout: string
}

export interface TelemetryData {
  driver: string
  year: number
  event: string
  session: string
  lap: number
  lap_time: number
  telemetry: {
    distance: number[]
    speed: number[]
    throttle: number[] | null
    brake: number[] | null
    gear: number[] | null
    rpm: number[] | null
    drs: number[] | null
    time: number[]
  }
}

export interface LapComparison {
  year: number
  event: string
  drivers: string[]
  lap_numbers: number[]
  lap_times: number[]
  driver_data: {
    driver: string
    driver_name: string
    team: string
    lap_number: number
    lap_time: number
    telemetry_data: {
      lap_number: number
      lap_time: number
      sector_1_time: string
      sector_2_time: string
      sector_3_time: string
      compound: string
      tyre_life: number
      stint_number: number
    }
    color: string
  }[]
}

export interface RaceStrategy {
  year: number
  event: string
  circuit: string
  drivers: string[]
  race_strategies: Record<
    string,
    {
      driver: string
      driver_name: string
      driver_code: string
      team: string
      team_color: string
      pit_stops: {
        lap: number
        total_pit_time: number
        new_compound: string
      }[]
      stints: {
        stint: number
        start_lap: number
        end_lap: number
        compound: string
        laps: number
      }[]
      total_pit_stops: number
      finish_position: number
    }
  >
}

export interface DriverProfile {
  name: string
  abbreviation: string
  number: string
  team: string
  country: string
  points: number
  championship_position: number
  races: number
  wins: number
  sprint_wins: number
  podiums: number
  sprint_podiums: number
  poles: number
  best_finish: number
  best_sprint_finish: number
  best_grid: number
  laps_led: number
  dnfs: number
}

export interface DriverResult {
  round: number
  name: string
  event_name: string
  location: string
  date: string
  grid: number
  position: number
  points: number
  status: string
  qualifying_position: number
}

export interface DriverStatistics {
  season: number | string
  name: string
  team: string
  championship_position: number
  points: number
  races: number
  wins: number
  podiums: number
  poles: number
  sprint_wins: number
  sprint_podiums: number
  best_finish: number
  best_sprint_finish: number
  best_grid: number
  dnfs: number
  laps_led: number
  avg_points: number
  avg_position: number
  avg_starting_grid: number
  seasons?: {
    year: number
    team_name: string
    championship_position: number
    points: number
    wins: number
  }[]
}

export interface DriverComparison {
  driver1: DriverStatistics
  driver2: DriverStatistics
  head_to_head: {
    races: {
      [driverId: string]: number
    }
    qualifying: {
      [driverId: string]: number
    }
  }
}

export interface TeamProfile {
  name: string
  drivers: {
    number: string
    name: string
    abbreviation: string
  }[]
  points: number
  championship_position: number
  wins: number
  podiums: number
  best_finish: number
}

export interface TeamStatistics {
  name: string
  championship_position: number
  points: number
  races: number
  wins: number
  podiums: number
  best_finish: number
  drivers: {
    number: string
    name: string
    abbreviation: string
    country?: string
  }[]
  driver_avg_positions: Record<string, number>
  seasons_active?: number
  championships?: number
  season_summaries?: {
    year: number
    championship_position: number
    points: number
    wins: number
    drivers: string[]
  }[]
}

export interface TeamResult {
  event: string
  round: number
  circuit: string
  date: string
  drivers: {
    driver_number: string
    driver_name: string
    driver_code: string
    grid: number
    position: number
    points: number
    status: string
    qualifying: number
  }[]
  total_points: number
}

export interface RaceResult {
  event: string
  circuit: string
  date: string
  results: {
    position: number
    driver_number: string
    driver_name: string
    driver_code: string
    team: string
    grid: number
    points: number
    status: string
    time: string | null
  }[]
}

export interface SessionResult {
  event: string
  circuit: string
  date: string
  session_type: string
  results: {
    position: number
    driver_number: string
    driver_name: string
    driver_code: string
    team: string
    time: string | null
    q1?: string | null
    q2?: string | null
    q3?: string | null
    laps?: number
  }[]
}

export interface RaceAnalysis {
  race_results: {
    position: number
    driver_number: string
    driver_name: string
    driver_code: string
    team: string
    team_color: string
    grid: number
    status: string
    time: string
    points: number
    qualifying_position: number
    positions_gained: number | null
  }[]
  qualifying_comparison: {
    position: number
    driver_number: string
    driver_name: string
    driver_code: string
    team: string
    team_color: string
    time: string
    q1_time: string
    q2_time: string
    q3_time: string
    laps: number
  }[]
  pit_stops: {
    driver_number: string
    driver_name: string
    driver_code: string
    team: string
    team_color: string
    stops: {
      lap: number
      pit_time: number
      new_compound: string
    }[]
    total_stops: number
  }[]
  stints: {
    driver: string
    driver_name: string
    driver_code: string
    team: string
    team_color: string
    stints: {
      stint: number
      start_lap: number
      end_lap: number
      compound: string
      laps: number
    }[]
    finish_position: number
  }[]
  overtakes: {
    lap: number
    driver: string
    driver_name: string
    driver_code: string
    team: string
    team_color: string
    positions_gained: number
    old_position: number
    new_position: number
  }[]
}

export interface DriverStanding {
  position: number
  driver_number: string
  name: string
  code: string
  team: string
  points: number
  wins: number
  podiums: number
  races: number
}

export interface ConstructorStanding {
  position: number
  team: string
  points: number
  wins: number
  podiums: number
  drivers: string[]
}

