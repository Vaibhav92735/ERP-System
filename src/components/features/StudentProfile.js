import { useState, useEffect } from "react";
import { getDatabase, ref, get, update, set } from "firebase/database";

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    roll_no: "",
    name: "",
    email: "",
    address: "",
    cgpa: "",
    degree: "",
    specialization: "",
    hostel: "",
    room: "",
  });

  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const fetchAllStudents = async () => {
      const db = getDatabase();
      const studentsRef = ref(db, "student-profile");

      try {
        const snapshot = await get(studentsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const studentsArray = Object.keys(data).map((rollNo) => ({
            rollNo,
            ...data[rollNo],
          }));
          setStudents(studentsArray);
        } else {
          setError("No student profiles found.");
        }
      } catch (err) {
        setError("Failed to load student profiles.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const studentRef = ref(db, `student-profile/${newStudent.roll_no}`);
    await set(studentRef, newStudent);
    setStudents((prev) => [...prev, newStudent]);
    setNewStudent({
      roll_no: "",
      name: "",
      email: "",
      year: "",
      address: "",
      cgpa: "",
      degree: "",
      specialization: "",
      hostel: "",
      room: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (rollNo) => {
    const db = getDatabase();
    const studentRef = ref(db, `student-profile/${rollNo}`);
    await update(studentRef, editingStudent);
    setStudents((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo ? { ...student, ...editingStudent } : student
      )
    );
    setEditingStudent(null);
  };

  if (loading) {
    return <p>Loading student profiles...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">All Student Profiles</h2>

      {/* Add New Student Form */}
      <form onSubmit={handleAddStudent} className="mb-6">
        <h3 className="text-xl font-bold">Add New Student</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="roll_no"
            placeholder="Roll No"
            value={newStudent.roll_no}
            onChange={handleNewStudentChange}
            required
            className="border p-2"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newStudent.name}
            onChange={handleNewStudentChange}
            required
            className="border p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="year"
            name="year"
            placeholder="Year"
            value={newStudent.year}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newStudent.address}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            value={newStudent.cgpa}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={newStudent.degree}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={newStudent.specialization}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="text"
            name="hostel"
            placeholder="Hostel"
            value={newStudent.hostel}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
          <input
            type="text"
            name="room"
            placeholder="Room"
            value={newStudent.room}
            onChange={handleNewStudentChange}
            className="border p-2"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2">
          Add Student
        </button>
      </form>

      {students.length > 0 ? (
        students.map((student) => (
          <div key={student.rollNo} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Roll No: {student.rollNo}</h3>
            {editingStudent && editingStudent.rollNo === student.rollNo ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={editingStudent.name}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="email"
                  name="email"
                  value={editingStudent.email}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="address"
                  value={editingStudent.address}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="number"
                  name="cgpa"
                  value={editingStudent.cgpa}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="degree"
                  value={editingStudent.degree}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="specialization"
                  value={editingStudent.specialization}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="hostel"
                  value={editingStudent.hostel}
                  onChange={handleEditChange}
                  className="border p-2"
                />
                <input
                  type="text"
                  name="room"
                  value={editingStudent.room}
                  onChange={handleEditChange}
                  className="border p-2"
                />
              </div>
            ) : (
              <>
                <p><strong>Name:</strong> {student.name || "N/A"}</p>
                <p><strong>Email:</strong> {student.email || "N/A"}</p>
                <p><strong>Year:</strong> {student.year || "N/A"}</p>
                <p><strong>Address:</strong> {student.address || "N/A"}</p>
                <p><strong>CGPA:</strong> {student.cgpa || "N/A"}</p>
                <p><strong>Degree:</strong> {student.degree || "N/A"}</p>
                <p><strong>Specialization:</strong> {student.specialization || "N/A"}</p>
                <p><strong>Hostel:</strong> {student.hostel || "N/A"}</p>
                <p><strong>Room:</strong> {student.room || "N/A"}</p>
                <button
                  onClick={() => {
                    setEditingStudent({ ...student });
                  }}
                  className="mt-2 bg-yellow-500 text-white p-2"
                >
                  Edit
                </button>
              </>
            )}
            {editingStudent && editingStudent.rollNo === student.rollNo && (
              <button
                onClick={() => handleSaveEdit(student.rollNo)}
                className="mt-2 bg-blue-500 text-white p-2"
              >
                Save
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No student profiles available.</p>
      )}
    </div>
  );
};

export default StudentProfiles;
