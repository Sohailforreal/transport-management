import { format, differenceInDays } from 'date-fns'

const AlertBadge = ({ expiryDate, label }) => {
  if (!expiryDate) return null

  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysLeft = differenceInDays(expiry, today)

  let style = ''
  let text = ''

  if (daysLeft < 0) {
    style = 'bg-red-500/20 text-red-400 border border-red-500/30'
    text = `${label} Expired`
  } else if (daysLeft <= 15) {
    style = 'bg-red-500/20 text-red-400 border border-red-500/30'
    text = `${label} expires in ${daysLeft}d`
  } else if (daysLeft <= 30) {
    style = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    text = `${label} expires in ${daysLeft}d`
  } else {
    style = 'bg-green-500/20 text-green-400 border border-green-500/30'
    text = `${label} valid till ${format(expiry, 'dd MMM yyyy')}`
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {text}
    </span>
  )
}

export default AlertBadge
