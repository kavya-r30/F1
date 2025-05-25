import { fetchWithCache } from "./cache"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }
  return response.json()
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    return handleResponse<T>(response)
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

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
  first_grand_prix: string
  number_of_laps: number
  circuit_length: number
  race_distance: number
  lap_record_time: string
  lap_record_driver: string
  lap_record_year: number
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

export interface RacePositionData {
  year: number
  event: string
  event_round: number
  drivers: string[]
  race_positions: Record<
    string,
    {
      driver: string
      driver_name: string
      abbreviation: string
      team: string
      team_color: string
      positions: {
        lap: number
        position: number
      }[]
    }
  >
}

export async function getEvents(year?: number): Promise<Event[]> {
  const endpoint = year ? `/events?year=${year}` : "/events"
  const cacheKey = `events_${year || "all"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ events: Event[] }>(endpoint)
    return data.events
  }, cacheKey)
}

export async function getDrivers(year?: number): Promise<Driver[]> {
  const endpoint = year ? `/drivers?year=${year}` : "/drivers"
  const cacheKey = `drivers_${year || "current"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ drivers: Driver[] }>(endpoint)
    return data.drivers
  }, cacheKey)
}

export async function getTeams(year?: number): Promise<Team[]> {
  const endpoint = year ? `/teams?year=${year}` : "/teams"
  const cacheKey = `teams_${year || "current"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ teams: Team[] }>(endpoint)
    return data.teams
  }, cacheKey)
}

export async function getCircuitInfo(year: number, event: string): Promise<CircuitInfo> {
  const cacheKey = `circuit_info_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; circuit_info: CircuitInfo }>(
      `/circuit/info?year=${year}&event=${event}`,
    )
    return data.circuit_info
  }, cacheKey)
}

export async function getCalendar(year: number): Promise<Event[]> {
  const cacheKey = `calendar_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; events: Event[] }>(`/circuit/calendar?year=${year}`)
    return data.events
  }, cacheKey)
}

export async function getTelemetryData(
  year: number,
  event: string,
  driver: string,
  lap?: number,
): Promise<TelemetryData> {
  let endpoint = `/telemetry/data?year=${year}&event=${event}&driver=${driver}`
  if (lap) endpoint += `&lap=${lap}`

  const cacheKey = `telemetry_data_${year}_${event}_${driver}_${lap || "fastest"}`

  return fetchWithCache(async () => {
    return await fetchApi<TelemetryData>(endpoint)
  }, cacheKey)
}

export async function getTrackPositions(year: number, event: string, session: string, drivers: string[], lapNumbers?: number[],
): Promise<any> {
  let endpoint = `/track/positions?year=${year}&event=${event}&session=${session}&drivers=${drivers.join(",")}`
  if (lapNumbers && lapNumbers.length > 0) {
    endpoint += `&lap_numbers=${lapNumbers.join(",")}`
  }

  const lapNumbersStr = lapNumbers ? lapNumbers.join("_") : "all"
  const cacheKey = `track_positions_${year}_${event}_${session}_${drivers.join("_")}_${lapNumbersStr}`

  return fetchWithCache(async () => {
    return await fetchApi<any>(endpoint)
  }, cacheKey)
}

export async function getRacePositions(year: number, event: string): Promise<RacePositionData> {
  const endpoint = `/position/race?year=${year}&event=${event}`
  const cacheKey = `race_positions_${year}_${event}`

  return fetchWithCache(async () => {
    return await fetchApi<RacePositionData>(endpoint)
  }, cacheKey)
}

export async function getFastestLap(year: number, event: string, driver: string): Promise<any> {
  const cacheKey = `fastest_lap_${year}_${event}_${driver}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; fastest_lap: any }>(
      `/lap/fastest?year=${year}&event=${event}&driver=${driver}`,
    )
    return data.fastest_lap
  }, cacheKey)
}

export async function compareLaps(year: number, event: string, drivers: string[], lapNumbers?: number[],
): Promise<LapComparison> {
  let endpoint = `/lap/compare?year=${year}&event=${event}&drivers=${drivers.join(",")}`
  if (lapNumbers && lapNumbers.length > 0) {
    endpoint += `&lap_number=${lapNumbers.join(",")}`
  }

  const lapNumbersStr = lapNumbers ? lapNumbers.join("_") : "fastest"
  const cacheKey = `lap_compare_${year}_${event}_${drivers.join("_")}_${lapNumbersStr}`

  return fetchWithCache(async () => {
    return await fetchApi<LapComparison>(endpoint)
  }, cacheKey)
}

export async function getRaceStrategy(year: number, event: string): Promise<RaceStrategy> {
  const cacheKey = `race_strategy_${year}_${event}`

  return fetchWithCache(async () => {
    return await fetchApi<RaceStrategy>(`/strategy/race?year=${year}&event=${event}`)
  }, cacheKey)
}

export async function getDriverProfile(driver: string, year?: number): Promise<DriverProfile> {
  let endpoint = `/driver/profile?driver=${driver}`
  if (year) endpoint += `&year=${year}`

  const cacheKey = `driver_profile_${driver}_${year || "current"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ driver_id: string; year: number; profile: DriverProfile }>(endpoint)
    return data.profile
  }, cacheKey)
}

export async function getDriverResults(driver: string, year: number): Promise<DriverResult[]> {
  const endpoint = `/driver/results?driver=${driver}&year=${year}`
  const cacheKey = `driver_results_${driver}_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ driver_id: string; year: number; results: DriverResult[] }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getDriverStatistics(driver: string, year?: number): Promise<DriverStatistics> {
  let endpoint = `/driver/statistics?driver=${driver}`
  if (year) endpoint += `&year=${year}`

  const cacheKey = `driver_statistics_${driver}_${year || "all"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ driver_id: string; year: number | string; statistics: DriverStatistics }>(endpoint)
    return data.statistics
  }, cacheKey)
}

export async function compareDrivers(driver1: string, driver2: string, year: number): Promise<DriverComparison> {
  const endpoint = `/driver/head-to-head?driver1=${driver1}&driver2=${driver2}&year=${year}`
  const cacheKey = `driver_comparison_${driver1}_${driver2}_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ driver1: string; driver2: string; year: number; comparison: DriverComparison }>(
      endpoint,
    )
    return data.comparison
  }, cacheKey)
}

export async function getTeamProfile(team: string, year?: number): Promise<TeamProfile> {
  let endpoint = `/team/profile?team=${team}`
  if (year) endpoint += `&year=${year}`

  const cacheKey = `team_profile_${team}_${year || "current"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ team_id: string; year: number; profile: TeamProfile }>(endpoint)
    return data.profile
  }, cacheKey)
}

export async function getTeamResults(team: string, year: number): Promise<TeamResult[]> {
  const endpoint = `/team/results?team=${team}&year=${year}`
  const cacheKey = `team_results_${team}_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ team_id: string; year: number; results: TeamResult[] }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getTeamStatistics(team: string, year?: number): Promise<TeamStatistics> {
  let endpoint = `/team/statistics?team=${team}`
  if (year) endpoint += `&year=${year}`

  const cacheKey = `team_statistics_${team}_${year || "all"}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ team_id: string; year: number | string; statistics: TeamStatistics }>(endpoint)
    return data.statistics
  }, cacheKey)
}

export async function getRaceResults(year: number, event: string): Promise<RaceResult> {
  const endpoint = `/race/results?year=${year}&event=${event}`
  const cacheKey = `race_results_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; results: RaceResult }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getSessionResults(year: number, event: string, session: string): Promise<SessionResult> {
  const endpoint = `/race/session-results?year=${year}&event=${event}&session=${session}`
  const cacheKey = `session_results_${year}_${event}_${session}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; session: string; results: SessionResult }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getQualifyingResults(year: number, event: string): Promise<SessionResult> {
  const endpoint = `/race/qualifying-results?year=${year}&event=${event}`
  const cacheKey = `qualifying_results_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; results: SessionResult }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getSprintResults(year: number, event: string): Promise<RaceResult> {
  const endpoint = `/race/sprint-results?year=${year}&event=${event}`
  const cacheKey = `sprint_results_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; results: RaceResult }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getSprintQualifyingResults(year: number, event: string): Promise<SessionResult> {
  const endpoint = `/race/session-results?year=${year}&event=${event}&session=SQ`
  const cacheKey = `sprint_qualifying_results_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; session: string; results: SessionResult }>(endpoint)
    return data.results
  }, cacheKey)
}

export async function getRaceAnalysis(year: number, event: string): Promise<RaceAnalysis> {
  const endpoint = `/race/analysis?year=${year}&event=${event}`
  const cacheKey = `race_analysis_${year}_${event}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; event: string; analysis: RaceAnalysis }>(endpoint)
    return data.analysis
  }, cacheKey)
}

export async function getDriverStandings(year: number): Promise<DriverStanding[]> {
  const endpoint = `/standing/driver-standings?year=${year}`
  const cacheKey = `driver_standings_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; round: string; standings: DriverStanding[] }>(endpoint)
    return data.standings
  }, cacheKey)
}

export async function getConstructorStandings(year: number): Promise<ConstructorStanding[]> {
  const endpoint = `/standing/constructor-standings?year=${year}`
  const cacheKey = `constructor_standings_${year}`

  return fetchWithCache(async () => {
    const data = await fetchApi<{ year: number; standings: ConstructorStanding[] }>(endpoint)
    return data.standings
  }, cacheKey)
}

export async function getSeasons(): Promise<number[]> {
  const cacheKey = "seasons"

  return fetchWithCache(async () => {
    const data = await fetchApi<{ seasons: number[] }>("/seasons")
    return data.seasons
  }, cacheKey)
}

export async function healthCheck(): Promise<{ status: string; message: string }> {
  return fetchApi("/health")
}
