export const compare = {
  date(start: string, end: string): number {
    if (start === end) {
      return 0
    }

    if (start.length <= end.length && start < end) {
      return -1
    } else {
      return 1
    }
  },
  time(start: string, end: string): number {
    if (start === end) {
      return 0
    }

    if (end === '00:00' || start < end) {
      return -1
    } else {
      return 1
    }
  }
}
