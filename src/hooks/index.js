import { useDispatch } from 'react-redux'
import { setNotificationText } from '../reducers/notificationReducer'

export const useNotification = () => {
  const dispatch = useDispatch()

  const showInfo = (info, error) => {
    const newActionInfo = { text: info, error: error ? true : false }
    dispatch(setNotificationText(newActionInfo, 5))
    setTimeout(() => {
      dispatch(setNotificationText({ text: '', error: false }, 5))
    }, 5000)
  }

  return showInfo
}
