import dtime from 'time-formater'

const FORMAT = {
  year: 'yyyy',
  month: 'MM',
  date: 'dd',
  hour: 'HH',
  minute: 'mm',
  second: 'ss'
}

export function getTime(t, format) {
  let time
  if (t) {
    time = new Date(t)
  } else {
    time = new Date()
  }
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  const timed = {
    year: year,
    month: month > 9 ? month : ('0' + month),
    date: date > 9 ? date : ('0' + date),
    hour: hour > 9 ? hour : ('0' + hour),
    minute: minute > 9 ? minute : ('0' + minute),
    second: second > 9 ? second : ('0' + second)
  }
  if (!format) {
    format = 'yyyy-MM-dd HH:mm:ss'
  }
  for (const val in FORMAT) {
    format = format.replace(FORMAT[val], timed[val])
  }
  return format
}

export function getMonths(type, length) {
  if (type === 'year') {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const months = []
    for (let i = 11; i >= 0; i--) {
      const month_ = month - i
      if (month_ <= 0) {
        let month = (12 - Math.abs(month_))
        if (month < 10) {
          month = '0' + month
        }
        months.push(year - 1 + '-' + month)
      } else {
        let month = month_
        if (month < 10) {
          month = '0' + month
        }
        months.push(year + '-' + month)
      }
    }
    return months
  } else {
    const day = []
    for (let i = length; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format('YYYY-MM-DD')
      day.push(date)
    }
    return day
  }
}
