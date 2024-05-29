// MembersList.js
import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebaseConfig";

const MembersList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map((doc) => doc.data());
      setMembers(membersList);
    };

    fetchMembers();
  }, []);

  return (
    <div>
      <h2>Mitglieder</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            <img src={member.photoURL} alt={member.displayName} width="50" />
            {member.displayName} ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersList;
