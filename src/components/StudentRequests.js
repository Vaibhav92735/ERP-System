"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, set, onValue } from '@/firebase/config';

const StudentRequests = () => {
    const searchParams = useSearchParams();
    const username = searchParams.get('username'); // Get student username from URL params

    const [requestType, setRequestType] = useState('');
    const [details, setDetails] = useState({ reason: '', startDate: '', endDate: '', attachment: '' });
    const [requests, setRequests] = useState([]);

    // Fetch existing requests for the student
    const fetchRequests = () => {
        const requestsRef = ref(database, `student-requests/${username}`);
        onValue(requestsRef, (snapshot) => {
            if (snapshot.exists()) {
                const requestData = snapshot.val();
                const requestList = Object.keys(requestData).map(requestName => ({
                    requestName,
                    entries: Object.keys(requestData[requestName]).map(timestamp => ({
                        timestamp,
                        ...requestData[requestName][timestamp]
                    }))
                }));
                setRequests(requestList);
            } else {
                setRequests([]);
            }
        });
    };

    // Handle request submission
    const handleRequestSubmission = async () => {
        if (!requestType) return alert("Please select a request type.");

        const timestamp = Date.now().toString();

        const requestDetails = {
            ...details,
            roll_no: username,
            granted: 0, // initially set to not granted
        };

        try {
            const requestRef = ref(database, `student-requests/${username}/${requestType}/${timestamp}`);
            await set(requestRef, requestDetails);
            alert("Request submitted successfully!");
            fetchRequests(); // Refresh requests list
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    return (
        <div className="p-8 bg-[#f3e9dc] min-h-screen font-serif">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#5a4b3b]">Student Request Portal</h2>
            
            {/* Request Form */}
            <div className="mb-8 p-6 bg-[#f7f1e3] border border-[#d4c2a2] shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#5a4b3b]">New Request</h3>
                <label className="block font-medium mb-2 text-[#5a4b3b]">Request Type</label>
                <select
                    className="w-full p-3 border border-[#d4c2a2] bg-[#f3e9dc] rounded mb-4"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                >
                    <option value="">Select a request type</option>
                    <option value="bonafide">Bonafide Certificate</option>
                    <option value="leave">Leave Request</option>
                    {/* Add more request types here as needed */}
                </select>
                
                {/* Request Details */}
                {requestType === 'leave' && (
                    <>
                        <label className="font-medium mb-2 text-[#5a4b3b]">Leave Details</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[#5a4b3b]">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-[#d4c2a2] rounded bg-[#f3e9dc]"
                                    value={details.startDate}
                                    onChange={(e) => setDetails({ ...details, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[#5a4b3b]">End Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-[#d4c2a2] rounded bg-[#f3e9dc]"
                                    value={details.endDate}
                                    onChange={(e) => setDetails({ ...details, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-[#5a4b3b]">Reason</label>
                            <textarea
                                className="w-full p-2 border border-[#d4c2a2] rounded bg-[#f3e9dc]"
                                value={details.reason}
                                onChange={(e) => setDetails({ ...details, reason: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-[#5a4b3b]">Attachment Link</label>
                            <input
                                type="url"
                                className="w-full p-2 border border-[#d4c2a2] rounded bg-[#f3e9dc]"
                                value={details.attachment}
                                onChange={(e) => setDetails({ ...details, attachment: e.target.value })}
                            />
                        </div>
                    </>
                )}
                {requestType === 'bonafide' && (
                    <div className="mb-4">
                        <label className="text-[#5a4b3b]">Reason</label>
                        <textarea
                            className="w-full p-2 border border-[#d4c2a2] rounded bg-[#f3e9dc]"
                            value={details.reason}
                            onChange={(e) => setDetails({ ...details, reason: e.target.value })}
                        />
                    </div>
                )}
                
                <button onClick={handleRequestSubmission} className="bg-[#8b6a47] text-white p-3 rounded-lg w-full mt-4">
                    Submit Request
                </button>
            </div>

            {/* Display Existing Requests */}
            <div className="mt-8 p-6 bg-[#f7f1e3] border border-[#d4c2a2] rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#5a4b3b]">Your Requests</h3>
                {requests.length === 0 ? (
                    <p className="text-gray-600">No requests found.</p>
                ) : (
                    <ul>
                        {requests.map((req) => (
                            <li key={req.requestName} className="mb-6 p-4 border border-[#d4c2a2] bg-[#f7f1e3] rounded-lg shadow-md">
                                <h4 className="text-lg font-semibold text-[#5a4b3b]">{req.requestName}</h4>
                                {req.entries.map(entry => (
                                    <div key={entry.timestamp} className="p-3 border border-[#d4c2a2] rounded mt-4 bg-[#f3e9dc] shadow">
                                        <p><strong className="text-[#5a4b3b]">Request Date:</strong> {new Date(parseInt(entry.timestamp)).toLocaleString()}</p>
                                        <p><strong className="text-[#5a4b3b]">Reason:</strong> {entry.reason}</p>
                                        <p><strong className="text-[#5a4b3b]">Status:</strong> <span className={entry.granted ? "text-green-600" : "text-yellow-600"}>{entry.granted ? "Granted" : "Pending"}</span></p>
                                        {entry.startDate && <p><strong className="text-[#5a4b3b]">Start Date:</strong> {entry.startDate}</p>}
                                        {entry.endDate && <p><strong className="text-[#5a4b3b]">End Date:</strong> {entry.endDate}</p>}
                                        {entry.attachment && <p><strong className="text-[#5a4b3b]">Attachment:</strong> <a href={entry.attachment} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View Document</a></p>}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StudentRequests;
