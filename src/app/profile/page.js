// "use client"; // Ensure it's a client component

// import { useEffect, useState } from "react";
// import { useSearchParams } from 'next/navigation'; // New way of getting search params in Next.js 13+
// import Profile from '../../components/Profile';
// import { ref, get, database } from '../../firebase/config';
// import Header from "@/components/Header";

// const ProfilePage = () => {
//   const searchParams = useSearchParams();
//   const username = searchParams.get('username'); // Extract the username from the URL

//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (username) {
//       const userRef = ref(database, `student-profile/${username}`);

//       // Fetch profile data from the database
//       const fetchProfileData = async () => {
//         try {
//           const snapshot = await get(userRef);
//           if (snapshot.exists()) {
//             // console.log("Snapshot Data:", snapshot.val()); // Debugging log to see the data
//             setProfileData(snapshot.val()); // Setting the profile data
//           } else {
//             setError("Profile not found.");
//           }
//         } catch (err) {
//           console.error("Error fetching profile:", err);
//           setError("Error fetching profile data.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchProfileData();
//     } else {
//       setError("No username provided.");
//       setLoading(false);
//     }
//   }, [username]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       {/* {console.log(profileData)} */}
//       <Header />
//       {profileData ? (
//         <Profile profile={profileData} />
        
//       ) : (
//         <p className="text-center">Please log in to view your profile.</p>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'; // New way of getting search params in Next.js 13+
import Profile from '../../components/Profile';
import { ref, get, database } from '../../firebase/config';
import Header from "@/components/Header";
import Menu from "@/components/Menu"; // Import the Menu component

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); // Extract the username from the URL

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      const userRef = ref(database, `student-profile/${username}`);

      // Fetch profile data from the database
      const fetchProfileData = async () => {
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setProfileData(snapshot.val()); // Setting the profile data
          } else {
            setError("Profile not found.");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Error fetching profile data.");
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
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
    <div>
      <Header />
      <Menu /> {/* Include the Menu component here */}
      {profileData ? (
        <Profile profile={profileData} />
      ) : (
        <p className="text-center">Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
