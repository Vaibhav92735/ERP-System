"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // New way of getting search params in Next.js 13+
import { database, ref, get } from "../../firebase/config"; // Adjust the import according to your Firebase config file
import Header from "@/components/Header";
import Menu from "@/components/Menu";

const FeesPage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Extract the username from the URL

  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      const feesRef = ref(database, `fees/${username}`);

      // Fetch fee data from the database
      const fetchFeeData = async () => {
        try {
          const snapshot = await get(feesRef);
          if (snapshot.exists()) {
            setFeeData(snapshot.val()); // Setting the fee data
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
    } else {
      setError("No username provided.");
      setLoading(false);
    }
  }, [username]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
        <Header />
        <Menu />
      <h2 className="text-2xl font-bold mb-4">Fee Details for {username}</h2>
      {feeData ? (
        <div>
          <p className="mb-2"><strong>Total Paid:</strong> {feeData['paid']}</p>
          <p><strong>Dues:</strong> {feeData.dues}</p>
        </div>
      ) : (
        <p className="text-center">No fee details available.</p>
      )}
    </div>
  );
};

export default FeesPage;
