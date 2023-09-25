export function formatSeason(season: string): string {
  // replace 'e' with 'Episode' and 'a' with 'Act'
  // e.g. 'e1a2' => 'Episode 1 Act 2'
  return season.replace(/e/g, "Episode ").replace(/a/g, " Act ")
}
