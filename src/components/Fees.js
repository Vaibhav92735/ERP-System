// FeesComponent.js

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { database, ref, get } from "../firebase/config";

const Fees = () => {
  const searchParams = useSearchParams();
  const username = atob(searchParams.get("username"));

  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeData = async () => {
      if (!username) {
        setError("No username provided.");
        setLoading(false);
        return;
      }

      const feesRef = ref(database, `fees/${username}`);

      try {
        const snapshot = await get(feesRef);
        if (snapshot.exists()) {
          setFeeData(snapshot.val());
        } else {
          setError("Fee details not found.");
        }
      } catch (err) {
        console.error("Error fetching fee data:", err);
        setError("Error fetching fee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [username]);

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: feeData.dues, // Amount to be paid
        }),
      });

      const orderData = await response.json();

      const options = {
        key: 'rzp_test_8YlkRAtlW7b1zk', // Razorpay Key ID
        amount: orderData.amount,
        currency: 'INR',
        name: 'Your University Name',
        description: 'Payment for pending dues',
        order_id: orderData.id,
        handler: function (response) {
          console.log("Payment successful", response);
          alert('Payment successful!');
        },
        prefill: {
          name: username,
          email: 'student@example.com', // Prefill with student details
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-10 max-w-xl bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-[#5A4A3B] mb-6">
        Fee Details for {username}
      </h2>

      {feeData ? (
        <div className="p-4 bg-[#faf3e0] border border-[#c9b79c] rounded-md shadow-md">
          <p className="mb-4 text-lg">
            <strong>Total Paid:</strong> ₹{Number(feeData['paid']).toLocaleString()}
          </p>
          <p className="text-lg mb-4">
            <strong>Dues:</strong> ₹{Number(feeData.dues).toLocaleString()}
          </p>
          <button
            onClick={handlePayment}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Pay Now
          </button>
        </div>
      ) : (
        <p className="text-center text-lg text-[#5b4636]">No fee details available.</p>
      )}
    </div>
  );
};

export default Fees;
