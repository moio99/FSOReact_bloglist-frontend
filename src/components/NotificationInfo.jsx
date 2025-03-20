import { useSelector } from 'react-redux'

const notificationStyle = {
  fontStyle: 'italic',
  fontSize: 16,
  background: 'lightgrey',
  padding: '10px',
  borderStyle: 'solid',
  borderRadius: '5px',
  marginBottom: '10px',
}

const notificationInfoStyle = (error) => {
  if (error) {
    return { ...notificationStyle, color: 'red' }
  } else {
    return { ...notificationStyle, color: 'green' }
  }
}

const NotificationInfo = () => {
  // Quando cambia state.notification notification tem um novo valor, isto faz que se rederice de novo
  const notification = useSelector(state => state.notification)

  if (notification.text !== '') {
    return (
      <div style={notificationInfoStyle(notification.error)}>
        {notification.text}
      </div>
    )
  }
}

export default NotificationInfo
