const Notification = ({ message, hasError }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={`notification ${hasError ? 'error' : ''}`}>
            {message}
        </div>
    )
}

export default Notification