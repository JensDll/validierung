export const compareDate = (start: string, end: string) => {
  if (start === end) {
    return 0
  }

  if (
    start.length < end.length ||
    (start.length === end.length && start < end)
  ) {
    return -1
  }

  return 1
}
