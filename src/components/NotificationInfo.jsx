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

const NotificationInfo = (notification) => {
  if (notification.values.text !== '') {
    return (
      <div style={notificationInfoStyle(notification.values.error)}>
        {notification.values.text}
      </div>
    )
  }
}

export default NotificationInfo
