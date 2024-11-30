export type Status = 'completed' | 'in_progress' | 'error' | 'created'

interface StatusInfo {
  title: string // Название на русском
  bgColor: string // Цвет фона
  borderColor: string // Цвет границы
}

const stateColors: Record<string, string> = {
  Обработано: '#F4FCE3',
  'В процессе': '#FFF9DB',
  Ошибка: '#FFEAF7',
  Создано: '#E1F4FF',
}

const borderStateColors: Record<string, string> = {
  Обработано: '#A9E34B',
  'В процессе': '#FFD43B',
  Ошибка: '#F179C1',
  Создано: '#83D2FF',
}

// Функция для получения информации о статусе
export const getStatusInfo = (status: Status): StatusInfo => {
  let title: string
  let bgColor: string
  let borderColor: string

  switch (status) {
    case 'completed':
      title = 'Обработано'
      bgColor = stateColors[title]
      borderColor = borderStateColors[title]
      break
    case 'in_progress':
      title = 'В процессе'
      bgColor = stateColors[title]
      borderColor = borderStateColors[title]
      break
    case 'error':
      title = 'Ошибка'
      bgColor = stateColors[title]
      borderColor = borderStateColors[title]
      break
    case 'created':
      title = 'Создано'
      bgColor = stateColors[title]
      borderColor = borderStateColors[title]
      break
    default:
      title = 'Неизвестно'
      bgColor = '#F4F4F4'
      borderColor = '#CCCCCC'
  }

  return { title, bgColor, borderColor }
}
