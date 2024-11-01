import React, { useState } from 'react'
import TeachersProfiles from './features/TeachersProfiles';
import TeachersRequests from './features/TeachersRequests';

export default function TeachersPage() {
    const [comp, setComp] = useState("Profile");

    const handleSelect = (component) => {
        setComp(component);
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <h1 className='text-3xl font-bold mb-4'>Teachers Management</h1>
            <div className='flex space-x-4 mb-8'>
                <button onClick={() => handleSelect("Profile")}>Profiles</button>
                <button onClick={() => handleSelect("Requests")}>Requests</button>
            </div>
            <div className='className="p-4 rounded-lg shadow-md bg-white'>
                {comp === "Profile" && <TeachersProfiles />}
                {comp === "Requests" && <TeachersRequests />}
            </div>
        </div>
    )
}
