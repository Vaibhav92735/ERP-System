"use client";

import { useEffect, useState } from 'react';
import { database, ref, get, update } from '@/firebase/config';

const Requests = () => {
    const [pendingRequests, setPendingRequests] = useState({});

    // Fetch all pending requests on component mount
    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const requestsRef = ref(database, 'student-requests');
                const snapshot = await get(requestsRef);

                if (snapshot.exists()) {
                    const allRequests = snapshot.val();
                    const groupedRequests = {};

                    // Group pending requests by student roll number
                    Object.entries(allRequests).forEach(([username, requestTypes]) => {
                        Object.entries(requestTypes).forEach(([requestType, timestamps]) => {
                            Object.entries(timestamps).forEach(([timestamp, details]) => {
                                if (details.granted === 0) {
                                    if (!groupedRequests[username]) {
                                        groupedRequests[username] = [];
                                    }
                                    groupedRequests[username].push({
                                        type: requestType,
                                        timestamp,
                                        ...details,
                                    });
                                }
                            });
                        });
                    });
                    setPendingRequests(groupedRequests);
                }
            } catch (error) {
                console.error("Error fetching pending requests:", error);
            }
        };

        fetchPendingRequests();
    }, []);

    // Grant a pending request
    const handleGrantRequest = async (username, requestType, timestamp) => {
        try {
            const requestRef = ref(database, `student-requests/${username}/${requestType}/${timestamp}`);
            await update(requestRef, { granted: 1 });
            alert('Request granted successfully!');

            // Update state to reflect granted status
            setPendingRequests((prevRequests) => {
                const updatedRequests = { ...prevRequests };
                updatedRequests[username] = updatedRequests[username].filter(
                    (request) => !(request.type === requestType && request.timestamp === timestamp)
                );

                // Remove student if no pending requests remain
                if (updatedRequests[username].length === 0) {
                    delete updatedRequests[username];
                }

                return updatedRequests;
            });
        } catch (error) {
            console.error("Error granting request:", error);
        }
    };

    return (
        <div className="admin-requests-container p-8">
            <h1 className="text-2xl font-bold mb-6">Pending Requests</h1>

            {Object.keys(pendingRequests).length === 0 ? (
                <p className="text-gray-500">No pending requests at the moment.</p>
            ) : (
                Object.entries(pendingRequests).map(([username, requests]) => (
                    <div key={username} className="student-requests mb-8 p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Student Username: {username}</h2>

                        <ul className="request-list">
                            {requests.map((request, index) => (
                                <li key={index} className="mb-4 border-b pb-4">
                                    <p className="font-semibold">Request Type: {request.type}</p>
                                    <p>Reason: {request.reason}</p>
                                    {request.startDate && <p>Start Date: {request.startDate}</p>}
                                    {request.endDate && <p>End Date: {request.endDate}</p>}
                                    <p>Attachment: {request.attachment || "N/A"}</p>
                                    <p>Status: {request.granted === 1 ? "Granted" : "Pending"}</p>

                                    <button
                                        onClick={() => handleGrantRequest(username, request.type, request.timestamp)}
                                        className="mt-2 bg-green-600 text-white p-2 rounded-lg"
                                    >
                                        Grant Request
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default Requests;
