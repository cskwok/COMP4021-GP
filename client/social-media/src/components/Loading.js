import React from 'react'

const Loading = () => {
    return (
        <div className="d-flex justify-content-center mt-3">
            <div className="spinner-grow text-secondary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Loading
