export const compare = {
  date(start: string, end: string): number {
    if (start === end) {
      return 0
    }

    if (
      start.length < end.length ||
      (start.length === end.length && start < end)
    ) {
      return -1
    } else {
      return 1
    }
  }
}
