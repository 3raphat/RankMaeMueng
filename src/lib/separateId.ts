export function separateId(id: string) {
  const [name, tag] = id.split("#")
  return { name, tag }
}
