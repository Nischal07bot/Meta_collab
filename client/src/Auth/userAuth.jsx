import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Context/userContext'    

const UserAuth = ({ children }) => {

    const { user } = useUser()
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setLoading(false)
        }
        if (!token) {
            navigate('/login')
        }

        if (!user) {
            navigate('/login')
        }

    }, [])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {children}</>
    )
}

export default UserAuth