import { get, getDatabase, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';

export default function TeachersProfiles() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    Name: "",
    Department: "",
    Position: "",
    Room_No: "",
    Teacher_ID: ""
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      const db = getDatabase();
      const teachersRef = ref(db, 'teacher-profile');
      try {
        const snapshot = await get(teachersRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const teachersArr = Object.keys(data).map((Teacher_ID) => ({
            Teacher_ID,
            ...data[Teacher_ID],
          }));
          setTeachers(teachersArr);
        } else {
          setError("No profiles found");
        }
      } catch (err) {
        setError("Failed to load teacher profiles.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleNewTeacherChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const teacherRef = ref(db, `teacher-profile/${newTeacher.Teacher_ID}`);
    await set(teacherRef, newTeacher);
    setTeachers((prev) => [...prev, newTeacher]);
    setNewTeacher({
      Name: "",
      Department: "",
      Position: "",
      Teacher_ID: "",
      Room_No: "",
    });
  };

  const handleSaveEdit = async (Teacher_ID) => {
    const db = getDatabase();
    const teacherRef = ref(db, `teacher-profile/${Teacher_ID}`);
    await update(teacherRef, editing);
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.Teacher_ID === Teacher_ID ? { ...teacher, ...editing } : teacher
      )
    );
    setEditing(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className='bg-red-600'>{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">All Teachers Profiles</h2>
      <form onSubmit={handleAddTeacher} className="mb-6">
        <h3 className="text-xl font-bold">Add New Teacher</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="Teacher_ID"
            placeholder="Teacher ID"
            value={newTeacher.Teacher_ID}
            onChange={handleNewTeacherChange}
            required
            className="border p-2"
          />
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={newTeacher.Name}
            onChange={handleNewTeacherChange}
            required
            className="border p-2"
          />
          <input
            type="text"
            name="Department"
            placeholder="Department"
            value={newTeacher.Department}
            onChange={handleNewTeacherChange}
            className="border p-2"
          />
          <input
            type="text"
            name="Position"
            placeholder="Position"
            value={newTeacher.Position}
            onChange={handleNewTeacherChange}
            className="border p-2"
          />
          <input
            type="text"
            name="Room_No"
            placeholder="Room No"
            value={newTeacher.Room_No}
            onChange={handleNewTeacherChange}
            className="border p-2"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2">
          Add Teacher
        </button>
      </form>
      {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <div key={teacher.Teacher_ID} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Teacher ID: {teacher.Teacher_ID}</h3>
            {editing && editing.Teacher_ID === teacher.Teacher_ID ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="Name"
                  value={editing.Name}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="Department"
                  value={editing.Department}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="Room_No"
                  value={editing.Room_No}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="Position"
                  value={editing.Position}
                  onChange={handleEditChange}
                  className="border p-2"
                />
              </div>
            ) : (
              <>
                <p><strong>Name:</strong> {teacher.Name || "N/A"}</p>
                <p><strong>Room No:</strong> {teacher.Room_No || "N/A"}</p>
                <p><strong>Department:</strong> {teacher.Department || "N/A"}</p>
                <p><strong>Position:</strong> {teacher.Position || "N/A"}</p>
                <button
                  onClick={() => setEditing({ ...teacher })}
                  className="mt-2 bg-yellow-500 text-white p-2"
                >
                  Edit
                </button>
              </>
            )}
            {editing && editing.Teacher_ID === teacher.Teacher_ID && (
              <button
                onClick={() => handleSaveEdit(teacher.Teacher_ID)}
                className="mt-2 bg-blue-500 text-white p-2"
              >
                Save
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No Teachers Found</p>
      )}
    </div>
  );
}
