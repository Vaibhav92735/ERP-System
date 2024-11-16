// // import { useState, useEffect } from "react";
// // import { getDatabase, ref, get, update, set, query, orderByChild } from "firebase/database";
// // import * as BTreeModule from "sorted-btree";

// // class BSTNode {
// //   constructor(key, value) {
// //     this.key = key;
// //     this.value = value;
// //     this.left = null;
// //     this.right = null;
// //   }
// // }

// // // BST Class
// // class BST {
// //   constructor() {
// //     this.root = null;
// //   }

// //   // Insert into BST
// //   insert(key, value) {
// //     const newNode = new BSTNode(key, value);
// //     if (!this.root) {
// //       this.root = newNode;
// //     } else {
// //       this._insertNode(this.root, newNode);
// //     }
// //   }

// //   _insertNode(node, newNode) {
// //     if (newNode.key < node.key) {
// //       if (!node.left) {
// //         node.left = newNode;
// //       } else {
// //         this._insertNode(node.left, newNode);
// //       }
// //     } else {
// //       if (!node.right) {
// //         node.right = newNode;
// //       } else {
// //         this._insertNode(node.right, newNode);
// //       }
// //     }
// //   }

// //   // Search in BST
// //   search(key) {
// //     return this._searchNode(this.root, key);
// //   }

// //   _searchNode(node, key) {
// //     if (!node) return null;
// //     if (key === node.key) return node.value;
// //     return key < node.key ? this._searchNode(node.left, key) : this._searchNode(node.right, key);
// //   }
// // }

// // const StudentProfiles = () => {
// //   const [studentsTree, setStudentsTree] = useState(() => new BTreeModule.default());
// //   const [studentsBST, setStudentsBST] = useState(() => new BST.default());
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [tableIndices, setTableIndices] = useState(() => new BTreeModule.default());
// //   const [BSTndices, setBSTindices] = useState(() => new BST.default());
// //   const [currentTableIndex, setCurrentTableIndex] = useState(0);
// //   const STUDENTS_PER_TABLE = 25;

// //   const [indices, setIndices] = useState({
// //     nameIndex: new BTreeModule.default(),
// //     cgpaIndex: new BTreeModule.default(),
// //     hostelIndex: new BTreeModule.default()
// //   });

// //   const [newStudent, setNewStudent] = useState({
// //     roll_no: "",
// //     name: "",
// //     email: "",
// //     address: "",
// //     cgpa: "",
// //     degree: "",
// //     specialization: "",
// //     hostel: "",
// //     room: "",
// //   });

// //   const [editingStudent, setEditingStudent] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [searchField, setSearchField] = useState("name");

// //   // Function to determine which table a student should be in
// //   const getTableIndex = (studentCount) => {
// //     return Math.floor(studentCount / STUDENTS_PER_TABLE);
// //   };

// //   const handleNewStudentChange = (e) => {
// //     const { name, value } = e.target;
// //     setNewStudent((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Function to create and update indices
// //   const updateIndices = async (student, operation = 'add', tableIndex) => {
// //     const db = getDatabase();
// //     const indexesRef = ref(db, 'indices');

// //     try {
// //       // Update table index
// //       const tableIndexRef = ref(db, `indicesBTree/tables/${student.roll_no}`);
// //       const tableIndexRefBST = ref(db, `indicesBST/tables/${student.roll_no}`);
// //       if (operation === 'add') {
// //         await set(tableIndexRef, tableIndex);
// //         tableIndices.set(student.roll_no, tableIndex);
// //         await set(tableIndexRefBST, tableIndex);
// //         tableIndices.set(student.roll_no, tableIndex);
// //       } else {
// //         await set(tableIndexRef, null);
// //         tableIndices.delete(student.roll_no);
// //         await set(tableIndexRefBST, null);
// //         tableIndices.delete(student.roll_no);
// //       }

// //       // Create/Update name index
// //       const nameIndexRef = ref(db, `indicesBTree/name/${student.name.toLowerCase()}/${student.roll_no}`);
// //       if (operation === 'add') {
// //         await set(nameIndexRef, tableIndex);
// //       } else {
// //         await set(nameIndexRef, null);
// //       }

// //       // Create/Update CGPA index
// //       const cgpaIndexRef = ref(db, `indicesBTree/cgpa/${student.cgpa}/${student.roll_no}`);
// //       if (operation === 'add') {
// //         await set(cgpaIndexRef, tableIndex);
// //       } else {
// //         await set(cgpaIndexRef, null);
// //       }

// //       // Create/Update hostel index
// //       const hostelIndexRef = ref(db, `indicesBTree/hostel/${student.hostel}/${student.roll_no}`);
// //       if (operation === 'add') {
// //         await set(hostelIndexRef, tableIndex);
// //       } else {
// //         await set(hostelIndexRef, null);
// //       }

// //     } catch (err) {
// //       console.error("Error updating indices:", err);
// //       throw err;
// //     }
// //   };

// //   // Function to search using indices
// //   const searchStudents = async () => {
// //     if (!searchQuery) return;

// //     const db = getDatabase();
// //     let searchResults = new BTreeModule.default();

// //     try {
// //       setLoading(true);

// //       switch(searchField) {
// //         case 'name': {
// //           const nameIndexRef = ref(db, `indicesBTree/name/${searchQuery.toLowerCase()}`);
// //           const snapshot = await get(nameIndexRef);
// //           if (snapshot.exists()) {
// //             const studentEntries = snapshot.val();
// //             for (const [rollNo, tableIndex] of Object.entries(studentEntries)) {
// //               const studentRef = ref(db, `student-profile${tableIndex}/${rollNo}`);
// //               const studentSnapshot = await get(studentRef);
// //               if (studentSnapshot.exists()) {
// //                 searchResults.set(rollNo, studentSnapshot.val());
// //               }
// //             }
// //           }
// //           break;
// //         }
// //         case 'cgpa': {
// //           const cgpaIndexRef = ref(db, `indicesBTree/cgpa/${searchQuery}`);
// //           const snapshot = await get(cgpaIndexRef);
// //           if (snapshot.exists()) {
// //             const studentEntries = snapshot.val();
// //             for (const [rollNo, tableIndex] of Object.entries(studentEntries)) {
// //               const studentRef = ref(db, `student-profile${tableIndex}/${rollNo}`);
// //               const studentSnapshot = await get(studentRef);
// //               if (studentSnapshot.exists()) {
// //                 searchResults.set(rollNo, studentSnapshot.val());
// //               }
// //             }
// //           }
// //           break;
// //         }
// //         case 'hostel': {
// //           const hostelIndexRef = ref(db, `indicesBTree/hostel/${searchQuery}`);
// //           const snapshot = await get(hostelIndexRef);
// //           if (snapshot.exists()) {
// //             const studentEntries = snapshot.val();
// //             for (const [rollNo, tableIndex] of Object.entries(studentEntries)) {
// //               const studentRef = ref(db, `student-profile${tableIndex}/${rollNo}`);
// //               const studentSnapshot = await get(studentRef);
// //               if (studentSnapshot.exists()) {
// //                 searchResults.set(rollNo, studentSnapshot.val());
// //               }
// //             }
// //           }
// //           break;
// //         }
// //         default:
// //           // For non-indexed fields, need to search all tables
// //           const tableIndexSnapshot = await get(ref(db, 'indicesBTree/tables'));
// //           if (tableIndexSnapshot.exists()) {
// //             const tables = tableIndexSnapshot.val();
// //             for (const [rollNo, tableIndex] of Object.entries(tables)) {
// //               const studentRef = ref(db, `student-profile${tableIndex}/${rollNo}`);
// //               const studentSnapshot = await get(studentRef);
// //               if (studentSnapshot.exists()) {
// //                 const student = studentSnapshot.val();
// //                 if (student[searchField]?.toLowerCase().includes(searchQuery.toLowerCase())) {
// //                   searchResults.set(rollNo, student);
// //                 }
// //               }
// //             }
// //           }
// //       }

// //       setStudentsTree(searchResults);
// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setError("Failed to search students");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchAllStudents = async () => {
// //       const db = getDatabase();
// //       const tableIndexRef = ref(db, "indicesBTree/tables");
// //       const tableIndexRefBST = ref(db, "indicesBTree/tables");

// //       try {
// //         const indexSnapshot = await get(tableIndexRef);
// //         const indexSnapshotBST = await get(tableIndexRefBST);
// //         if (indexSnapshot.exists()) {
// //           const tableIndex = indexSnapshot.val();
// //           const newTree = new BTreeModule.default();
// //           const newTableIndices = new BTreeModule.default();

// //           // Get the maximum table index
// //           const maxTableIndex = Math.max(...Object.values(tableIndex));
// //           setCurrentTableIndex(maxTableIndex);

// //           // Fetch students from all tables
// //           for (let i = 0; i <= maxTableIndex; i++) {
// //             const tableRef = ref(db, `student-profile${i}`);
// //             const snapshot = await get(tableRef);
// //             if (snapshot.exists()) {
// //               const tableData = snapshot.val();
// //               Object.entries(tableData).forEach(([rollNo, student]) => {
// //                 newTree.set(rollNo, { rollNo, ...student });
// //                 newTableIndices.set(rollNo, i);
// //               });
// //             }
// //           }

// //           setStudentsBST(newTree);
// //           setBSTindices(newTableIndices);

// //           // Initialize indices
// //           const nameIdx = new BTreeModule.default();
// //           const cgpaIdx = new BTreeModule.default();
// //           const hostelIdx = new BTreeModule.default();

// //           Object.entries(tableIndex).forEach(([rollNo, tableIdx]) => {
// //             const student = newTree.get(rollNo);
// //             if (student) {
// //               // Name index
// //               if (student.name) {
// //                 const nameList = nameIdx.get(student.name.toLowerCase()) || new Map();
// //                 nameList.set(rollNo, tableIdx);
// //                 nameIdx.set(student.name.toLowerCase(), nameList);
// //               }

// //               // CGPA index
// //               if (student.cgpa) {
// //                 const cgpaList = cgpaIdx.get(student.cgpa) || new Map();
// //                 cgpaList.set(rollNo, tableIdx);
// //                 cgpaIdx.set(student.cgpa, cgpaList);
// //               }

// //               // Hostel index
// //               if (student.hostel) {
// //                 const hostelList = hostelIdx.get(student.hostel) || new Map();
// //                 hostelList.set(rollNo, tableIdx);
// //                 hostelIdx.set(student.hostel, hostelList);
// //               }
// //             }
// //           });

// //           setIndices({
// //             nameIndex: nameIdx,
// //             cgpaIndex: cgpaIdx,
// //             hostelIndex: hostelIdx
// //           });
// //         }


// //         if (indexSnapshotBST.exists()) {
// //           const tableIndex = indexSnapshot.val();
// //           const newTree = new BST.default();
// //           const newTableIndices = new BST.default();

// //           // Get the maximum table index
// //           const maxTableIndex = Math.max(...Object.values(tableIndex));
// //           setCurrentTableIndex(maxTableIndex);

// //           // Fetch students from all tables
// //           for (let i = 0; i <= maxTableIndex; i++) {
// //             const tableRef = ref(db, `student-profile${i}`);
// //             const snapshot = await get(tableRef);
// //             if (snapshot.exists()) {
// //               const tableData = snapshot.val();
// //               Object.entries(tableData).forEach(([rollNo, student]) => {
// //                 newTree.set(rollNo, { rollNo, ...student });
// //                 newTableIndices.set(rollNo, i);
// //               });
// //             }
// //           }

// //           setStudentsTree(newTree);
// //           setTableIndices(newTableIndices);

// //           // Initialize indices
// //           const nameIdx = new BST.default();
// //           const cgpaIdx = new BST.default();
// //           const hostelIdx = new BST.default();

// //           Object.entries(tableIndex).forEach(([rollNo, tableIdx]) => {
// //             const student = newTree.get(rollNo);
// //             if (student) {
// //               // Name index
// //               if (student.name) {
// //                 const nameList = nameIdx.get(student.name.toLowerCase()) || new Map();
// //                 nameList.set(rollNo, tableIdx);
// //                 nameIdx.set(student.name.toLowerCase(), nameList);
// //               }

// //               // CGPA index
// //               if (student.cgpa) {
// //                 const cgpaList = cgpaIdx.get(student.cgpa) || new Map();
// //                 cgpaList.set(rollNo, tableIdx);
// //                 cgpaIdx.set(student.cgpa, cgpaList);
// //               }

// //               // Hostel index
// //               if (student.hostel) {
// //                 const hostelList = hostelIdx.get(student.hostel) || new Map();
// //                 hostelList.set(rollNo, tableIdx);
// //                 hostelIdx.set(student.hostel, hostelList);
// //               }
// //             }
// //           });

// //           setIndices({
// //             nameIndex: nameIdx,
// //             cgpaIndex: cgpaIdx,
// //             hostelIndex: hostelIdx
// //           });
// //         }


// //       } catch (err) {
// //         setError("Failed to load student profiles.");
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAllStudents();
// //   }, []);

// //   const handleAddStudent = async (e) => {
// //     e.preventDefault();
// //     const db = getDatabase();

// //     try {
// //       // Determine which table to add the student to
// //       const tableIndex = getTableIndex(studentsTree.size);
// //       if (tableIndex > currentTableIndex) {
// //         setCurrentTableIndex(tableIndex);
// //       }

// //       // Reference to the correct table
// //       const studentRef = ref(db, `student-profile${tableIndex}/${newStudent.roll_no}`);

// //       // Save to Firebase
// //       await set(studentRef, newStudent);

// //       // Update indices
// //       await updateIndices(newStudent, 'add', tableIndex);

// //       // Update BTree
// //       setStudentsTree((prevTree) => {
// //         const newTree = new BTreeModule.default();
// //         Array.from(prevTree.entries()).forEach(([key, value]) => {
// //           newTree.set(key, value);
// //         });
// //         newTree.set(newStudent.roll_no, newStudent);
// //         return newTree;
// //       });

// //       // Reset form
// //       setNewStudent({
// //         roll_no: "",
// //         name: "",
// //         email: "",
// //         address: "",
// //         cgpa: "",
// //         degree: "",
// //         specialization: "",
// //         hostel: "",
// //         room: "",
// //       });
// //     } catch (err) {
// //       console.error("Failed to add student:", err);
// //       setError("Failed to add student.");
// //     }
// //   };

// //   const handleSaveEdit = async (rollNo) => {
// //     const db = getDatabase();
// //     const tableIndex = tableIndices.get(rollNo);
// //     if (tableIndex === undefined) {
// //       setError("Could not find student's table");
// //       return;
// //     }

// //     const studentRef = ref(db, `student-profile${tableIndex}/${rollNo}`);

// //     try {
// //       // Remove old indices
// //       const oldStudent = studentsTree.get(rollNo);
// //       if (oldStudent) {
// //         await updateIndices(oldStudent, 'remove', tableIndex);
// //       }

// //       // Update student data
// //       await update(studentRef, editingStudent);

// //       // Update new indices
// //       await updateIndices(editingStudent, 'add', tableIndex);

// //       setStudentsTree((prevTree) => {
// //         const newTree = new BTreeModule.default();
// //         Array.from(prevTree.entries()).forEach(([key, value]) => {
// //           if (key === rollNo) {
// //             newTree.set(key, { ...value, ...editingStudent });
// //           } else {
// //             newTree.set(key, value);
// //           }
// //         });
// //         return newTree;
// //       });

// //       setEditingStudent(null);
// //     } catch (err) {
// //       console.error("Failed to save student:", err);
// //       setError("Failed to save changes.");
// //     }
// //   };

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6">All Student Profiles</h2>

// //       {/* Search Section */}
// //       <div className="mb-6">
// //         <h3 className="text-xl font-bold mb-4">Search Students</h3>
// //         <div className="flex gap-4">
// //           <select 
// //             value={searchField}
// //             onChange={(e) => setSearchField(e.target.value)}
// //             className="border p-2 rounded"
// //           >
// //             <option value="name">Name</option>
// //             <option value="cgpa">CGPA</option>
// //             <option value="hostel">Hostel</option>
// //           </select>
// //           <input
// //             type="text"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             placeholder="Search..."
// //             className="border p-2 rounded flex-1"
// //           />
// //           <button
// //             onClick={searchStudents}
// //             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //           >
// //             Search
// //           </button>
// //         </div>
// //       </div>


// //       {/* Add New Student Form */}
// //       <form onSubmit={handleAddStudent} className="mb-6">
// //         <h3 className="text-xl font-bold mb-4">Add New Student</h3>
// //         <div className="grid grid-cols-2 gap-4 mb-4">
// //           <input
// //             type="text"
// //             name="roll_no"
// //             placeholder="Roll No"
// //             value={newStudent.roll_no}
// //             onChange={handleNewStudentChange}
// //             required
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Name"
// //             value={newStudent.name}
// //             onChange={handleNewStudentChange}
// //             required
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             value={newStudent.email}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="address"
// //             placeholder="Address"
// //             value={newStudent.address}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="number"
// //             name="cgpa"
// //             placeholder="CGPA"
// //             value={newStudent.cgpa}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="degree"
// //             placeholder="Degree"
// //             value={newStudent.degree}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="specialization"
// //             placeholder="Specialization"
// //             value={newStudent.specialization}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="hostel"
// //             placeholder="Hostel"
// //             value={newStudent.hostel}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="room"
// //             placeholder="Room"
// //             value={newStudent.room}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //         </div>
// //         <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
// //           Add Student
// //         </button>
// //       </form>

// //       {/* Student List */}
// //       {studentsTree.size > 0 ? (
// //         Array.from(studentsTree.entries()).map(([rollNo, student]) => (
// //           <div key={rollNo} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
// //             <h3 className="text-lg font-semibold mb-2">Roll No: {rollNo}</h3>
// //             {editingStudent && editingStudent.roll_no === rollNo ? (
// //               <div className="grid grid-cols-2 gap-4">
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={editingStudent.name}
// //                   onChange={handleEditChange}
// //                   className="border p-2 rounded"
// //                 />
// //                 {/* Add other edit fields as needed */}
// //                 <div className="col-span-2">
// //                   <button
// //                     onClick={() => handleSaveEdit(rollNo)}
// //                     className="mr-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={() => setEditingStudent(null)}
// //                     className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div>
// //                 <p><strong>Name:</strong> {student.name || "N/A"}</p>
// //                 <p><strong>Email:</strong> {student.email || "N/A"}</p>
// //                 <p><strong>CGPA:</strong> {student.cgpa || "N/A"}</p>
// //                 <p><strong>Degree:</strong> {student.degree || "N/A"}</p>
// //                 <p><strong>Department:</strong> {student.specialization || "N/A"}</p>
// //                 <p><strong>Address:</strong> {student.address || "N/A"}</p>
// //                 <p><strong>Hostel:</strong> {student.hostel || "N/A"}</p>
// //                 <p><strong>Room No:</strong> {student.room || "N/A"}</p>
// //                 <p><strong>Email ID:</strong> {student.email || "N/A"}</p>
// //                 <button
// //                   onClick={() => handleEdit(student)}
// //                   className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //                 >
// //                   Edit
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         ))
// //       ) : (
// //         <p>No student profiles available.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default StudentProfiles;



// // import { useState, useEffect } from "react";
// // import { getDatabase, ref, get, update, set } from "firebase/database";
// // import * as BTreeModule from "sorted-btree";

// // // BST Implementation
// // class BSTNode {
// //   constructor(key, value) {
// //     this.key = key;
// //     this.value = value;
// //     this.left = null;
// //     this.right = null;
// //   }
// // }

// // class BST {
// //   constructor() {
// //     this.root = null;
// //     this.size = 0;
// //   }

// //   insert(key, value) {
// //     const startTime = performance.now();
// //     const newNode = new BSTNode(key, value);
// //     if (!this.root) {
// //       this.root = newNode;
// //     } else {
// //       this._insertNode(this.root, newNode);
// //     }
// //     this.size++;
// //     return performance.now() - startTime;
// //   }

// //   _insertNode(node, newNode) {
// //     if (newNode.key < node.key) {
// //       if (!node.left) {
// //         node.left = newNode;
// //       } else {
// //         this._insertNode(node.left, newNode);
// //       }
// //     } else {
// //       if (!node.right) {
// //         node.right = newNode;
// //       } else {
// //         this._insertNode(node.right, newNode);
// //       }
// //     }
// //   }

// //   search(key) {
// //     const startTime = performance.now();
// //     const result = this._searchNode(this.root, key);
// //     return {
// //       value: result,
// //       time: performance.now() - startTime
// //     };
// //   }

// //   _searchNode(node, key) {
// //     if (!node) return null;
// //     if (key === node.key) return node.value;
// //     return key < node.key ? 
// //       this._searchNode(node.left, key) : 
// //       this._searchNode(node.right, key);
// //   }

// //   delete(key) {
// //     const startTime = performance.now();
// //     this.root = this._deleteNode(this.root, key);
// //     this.size--;
// //     return performance.now() - startTime;
// //   }

// //   _deleteNode(node, key) {
// //     if (!node) return null;

// //     if (key < node.key) {
// //       node.left = this._deleteNode(node.left, key);
// //       return node;
// //     } else if (key > node.key) {
// //       node.right = this._deleteNode(node.right, key);
// //       return node;
// //     }

// //     if (!node.left) return node.right;
// //     if (!node.right) return node.left;

// //     let minNode = this._findMin(node.right);
// //     node.key = minNode.key;
// //     node.value = minNode.value;
// //     node.right = this._deleteNode(node.right, minNode.key);
// //     return node;
// //   }

// //   _findMin(node) {
// //     while (node.left) {
// //       node = node.left;
// //     }
// //     return node;
// //   }
// // }

// // // Performance tracking wrapper for BTree
// // class BTreeWrapper {
// //   constructor() {
// //     this.tree = new BTreeModule.default();
// //     this.size = 0;
// //   }

// //   insert(key, value) {
// //     const startTime = performance.now();
// //     this.tree.set(key, value);
// //     this.size++;
// //     return performance.now() - startTime;
// //   }

// //   search(key) {
// //     const startTime = performance.now();
// //     const value = this.tree.get(key);
// //     return {
// //       value,
// //       time: performance.now() - startTime
// //     };
// //   }

// //   delete(key) {
// //     const startTime = performance.now();
// //     this.tree.delete(key);
// //     this.size--;
// //     return performance.now() - startTime;
// //   }
// // }

// // // Performance Statistics Component
// // const PerformanceStats = ({ bstStats, btreeStats }) => (
// //   <div className="mt-6 p-4 bg-gray-100 rounded-lg">
// //     <h3 className="text-xl font-bold mb-4">Performance Comparison</h3>
// //     <div className="grid grid-cols-2 gap-4">
// //       <div>
// //         <h4 className="font-semibold mb-2">BST Performance</h4>
// //         <p>Average Insert Time: {bstStats.avgInsert.toFixed(3)}ms</p>
// //         <p>Average Search Time: {bstStats.avgSearch.toFixed(3)}ms</p>
// //         <p>Average Delete Time: {bstStats.avgDelete.toFixed(3)}ms</p>
// //       </div>
// //       <div>
// //         <h4 className="font-semibold mb-2">BTree Performance</h4>
// //         <p>Average Insert Time: {btreeStats.avgInsert.toFixed(3)}ms</p>
// //         <p>Average Search Time: {btreeStats.avgSearch.toFixed(3)}ms</p>
// //         <p>Average Delete Time: {btreeStats.avgDelete.toFixed(3)}ms</p>
// //       </div>
// //     </div>
// //   </div>
// // );

// // const StudentProfiles = () => {
// //   const [studentsTree, setStudentsTree] = useState(() => new BTreeWrapper());
// //   const [studentsBST, setStudentsBST] = useState(() => new BST());
// //   const [performanceStats, setPerformanceStats] = useState({
// //     bst: {
// //       insertTimes: [],
// //       searchTimes: [],
// //       deleteTimes: [],
// //     },
// //     btree: {
// //       insertTimes: [],
// //       searchTimes: [],
// //       deleteTimes: [],
// //     }
// //   });

// //   // ... (keep existing state variables)
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [tableIndices, setTableIndices] = useState(() => new BTreeModule.default());
// //   // const [BSTndices, setBSTindices] = useState(() => new BST.default());
// //   const [currentTableIndex, setCurrentTableIndex] = useState(0);
// //   const STUDENTS_PER_TABLE = 25;

// //   const [indices, setIndices] = useState({
// //     nameIndex: new BTreeModule.default(),
// //     cgpaIndex: new BTreeModule.default(),
// //     hostelIndex: new BTreeModule.default()
// //   });

// //   const [newStudent, setNewStudent] = useState({
// //     roll_no: "",
// //     name: "",
// //     email: "",
// //     address: "",
// //     cgpa: "",
// //     degree: "",
// //     specialization: "",
// //     hostel: "",
// //     room: "",
// //   });

// //   const [editingStudent, setEditingStudent] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [searchField, setSearchField] = useState("name");

// //   // Function to calculate average of an array
// //   const calculateAverage = (arr) => arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0;

// //   // Function to update performance stats
// //   const updatePerformanceStats = (type, operation, time) => {
// //     setPerformanceStats(prev => ({
// //       ...prev,
// //       [type]: {
// //         ...prev[type],
// //         [`${operation}Times`]: [...prev[type][`${operation}Times`], time]
// //       }
// //     }));
// //   };

// //   const getTableIndex = (studentCount) => {
// //     return Math.floor(studentCount / STUDENTS_PER_TABLE);
// //   };

// //   const handleAddStudent = async (e) => {
// //     e.preventDefault();
// //     const db = getDatabase();

// //     try {
// //       const tableIndex = getTableIndex(studentsTree.size);
// //       if (tableIndex > currentTableIndex) {
// //         setCurrentTableIndex(tableIndex);
// //       }

// //       const studentRef = ref(db, `student-profile${tableIndex}/${newStudent.roll_no}`);

// //       // Save to Firebase
// //       await set(studentRef, newStudent);

// //       // Insert into both data structures and measure performance
// //       const btreeTime = studentsTree.insert(newStudent.roll_no, newStudent);
// //       const bstTime = studentsBST.insert(newStudent.roll_no, newStudent);

// //       // Update performance stats
// //       updatePerformanceStats('btree', 'insert', btreeTime);
// //       updatePerformanceStats('bst', 'insert', bstTime);

// //       // Reset form
// //       setNewStudent({
// //         roll_no: "",
// //         name: "",
// //         email: "",
// //         address: "",
// //         cgpa: "",
// //         degree: "",
// //         specialization: "",
// //         hostel: "",
// //         room: "",
// //       });
// //     } catch (err) {
// //       console.error("Failed to add student:", err);
// //       setError("Failed to add student.");
// //     }
// //   };

// //   // Modified search function to compare performance
// //   const searchStudents = async () => {
// //     if (!searchQuery) return;

// //     try {
// //       setLoading(true);

// //       // Perform search in both data structures
// //       const bstResult = studentsBST.search(searchQuery);
// //       const btreeResult = studentsTree.search(searchQuery);

// //       // Update performance stats
// //       updatePerformanceStats('bst', 'search', bstResult.time);
// //       updatePerformanceStats('btree', 'search', btreeResult.time);

// //       // Use BTree results for display (you could choose either)
// //       setStudentsTree(new BTreeWrapper().insert(searchQuery, btreeResult.value));

// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setError("Failed to search students");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Calculate performance statistics for display
// //   const getPerformanceStats = () => ({
// //     bst: {
// //       avgInsert: calculateAverage(performanceStats.bst.insertTimes),
// //       avgSearch: calculateAverage(performanceStats.bst.searchTimes),
// //       avgDelete: calculateAverage(performanceStats.bst.deleteTimes)
// //     },
// //     btree: {
// //       avgInsert: calculateAverage(performanceStats.btree.insertTimes),
// //       avgSearch: calculateAverage(performanceStats.btree.searchTimes),
// //       avgDelete: calculateAverage(performanceStats.btree.deleteTimes)
// //     }
// //   });

// //   const handleNewStudentChange = (e) => {
// //         const { name, value } = e.target;
// //         setNewStudent((prev) => ({ ...prev, [name]: value }));
// //       };

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6">All Student Profiles</h2>

// //       {/* Search Section */}
// //       <div className="mb-6">
// //         <h3 className="text-xl font-bold mb-4">Search Students</h3>
// //         <div className="flex gap-4">
// //           <select 
// //             value={searchField}
// //             onChange={(e) => setSearchField(e.target.value)}
// //             className="border p-2 rounded"
// //           >
// //             <option value="name">Name</option>
// //             <option value="cgpa">CGPA</option>
// //             <option value="hostel">Hostel</option>
// //           </select>
// //           <input
// //             type="text"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             placeholder="Search..."
// //             className="border p-2 rounded flex-1"
// //           />
// //           <button
// //             onClick={searchStudents}
// //             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //           >
// //             Search
// //           </button>
// //         </div>
// //       </div>


// //       {/* Add New Student Form */}
// //       <form onSubmit={handleAddStudent} className="mb-6">
// //         <h3 className="text-xl font-bold mb-4">Add New Student</h3>
// //         <div className="grid grid-cols-2 gap-4 mb-4">
// //           <input
// //             type="text"
// //             name="roll_no"
// //             placeholder="Roll No"
// //             value={newStudent.roll_no}
// //             onChange={handleNewStudentChange}
// //             required
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Name"
// //             value={newStudent.name}
// //             onChange={handleNewStudentChange}
// //             required
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             value={newStudent.email}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="address"
// //             placeholder="Address"
// //             value={newStudent.address}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="number"
// //             name="cgpa"
// //             placeholder="CGPA"
// //             value={newStudent.cgpa}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="degree"
// //             placeholder="Degree"
// //             value={newStudent.degree}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="specialization"
// //             placeholder="Specialization"
// //             value={newStudent.specialization}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="hostel"
// //             placeholder="Hostel"
// //             value={newStudent.hostel}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //           <input
// //             type="text"
// //             name="room"
// //             placeholder="Room"
// //             value={newStudent.room}
// //             onChange={handleNewStudentChange}
// //             className="border p-2 rounded"
// //           />
// //         </div>
// //         <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
// //           Add Student
// //         </button>
// //       </form>

// //       <PerformanceStats 
// //         bstStats={getPerformanceStats().bst}
// //         btreeStats={getPerformanceStats().btree}
// //       />

// //       {/* Student List */}
// //       {studentsTree.size > 0 ? (
// //         Array.from(studentsTree.entries()).map(([rollNo, student]) => (
// //           <div key={rollNo} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
// //             <h3 className="text-lg font-semibold mb-2">Roll No: {rollNo}</h3>
// //             {editingStudent && editingStudent.roll_no === rollNo ? (
// //               <div className="grid grid-cols-2 gap-4">
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={editingStudent.name}
// //                   onChange={handleEditChange}
// //                   className="border p-2 rounded"
// //                 />
// //                 {/* Add other edit fields as needed */}
// //                 <div className="col-span-2">
// //                   <button
// //                     onClick={() => handleSaveEdit(rollNo)}
// //                     className="mr-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={() => setEditingStudent(null)}
// //                     className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div>
// //                 <p><strong>Name:</strong> {student.name || "N/A"}</p>
// //                 <p><strong>Email:</strong> {student.email || "N/A"}</p>
// //                 <p><strong>CGPA:</strong> {student.cgpa || "N/A"}</p>
// //                 <p><strong>Degree:</strong> {student.degree || "N/A"}</p>
// //                 <p><strong>Department:</strong> {student.specialization || "N/A"}</p>
// //                 <p><strong>Address:</strong> {student.address || "N/A"}</p>
// //                 <p><strong>Hostel:</strong> {student.hostel || "N/A"}</p>
// //                 <p><strong>Room No:</strong> {student.room || "N/A"}</p>
// //                 <p><strong>Email ID:</strong> {student.email || "N/A"}</p>
// //                 <button
// //                   onClick={() => handleEdit(student)}
// //                   className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //                 >
// //                   Edit
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         ))
// //       ) : (
// //         <p>No student profiles available.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default StudentProfiles;

// import { useState, useEffect } from "react";
// import { getDatabase, ref, get, update, set } from "firebase/database";
// import * as BTreeModule from "sorted-btree";

// // BST Node and Implementation
// class BSTNode {
//   constructor(key, value) {
//     this.key = key;
//     this.value = value;
//     this.left = null;
//     this.right = null;
//   }
// }

// class BST {
//   constructor() {
//     this.root = null;
//   }

//   insert(key, value) {
//     const start = performance.now();
//     this._insert(key, value);
//     const end = performance.now();
//     return end - start;
//   }

//   _insert(key, value) {
//     const newNode = new BSTNode(key, value);
//     if (!this.root) {
//       this.root = newNode;
//       return;
//     }

//     let current = this.root;
//     while (true) {
//       if (key < current.key) {
//         if (!current.left) {
//           current.left = newNode;
//           break;
//         }
//         current = current.left;
//       } else {
//         if (!current.right) {
//           current.right = newNode;
//           break;
//         }
//         current = current.right;
//       }
//     }
//   }

//   search(key) {
//     const start = performance.now();
//     const result = this._search(this.root, key);
//     const end = performance.now();
//     return { result, time: end - start };
//   }

//   _search(node, key) {
//     if (!node || node.key === key) return node?.value || null;
//     if (key < node.key) return this._search(node.left, key);
//     return this._search(node.right, key);
//   }

//   delete(key) {
//     const start = performance.now();
//     this.root = this._deleteNode(this.root, key);
//     const end = performance.now();
//     return end - start;
//   }

//   _deleteNode(node, key) {
//     if (!node) return null;

//     if (key < node.key) {
//       node.left = this._deleteNode(node.left, key);
//       return node;
//     } else if (key > node.key) {
//       node.right = this._deleteNode(node.right, key);
//       return node;
//     }

//     if (!node.left) return node.right;
//     if (!node.right) return node.left;

//     let minNode = this._findMin(node.right);
//     node.key = minNode.key;
//     node.value = minNode.value;
//     node.right = this._deleteNode(node.right, minNode.key);
//     return node;
//   }

//   _findMin(node) {
//     while (node.left) {
//       node = node.left;
//     }
//     return node;
//   }
// }

// // Performance tracking wrapper for BTree
// class BTreeWrapper {
//   constructor() {
//     this.tree = new BTreeModule.default();
//   }

//   insert(key, value) {
//     const start = performance.now();
//     this.tree.set(key, value);
//     const end = performance.now();
//     return end - start;
//   }

//   search(key) {
//     const start = performance.now();
//     const result = this.tree.get(key);
//     const end = performance.now();
//     return { result, time: end - start };
//   }

//   delete(key) {
//     const start = performance.now();
//     this.tree.delete(key);
//     const end = performance.now();
//     return end - start;
//   }
// }

// const StudentProfiles = () => {
//   // State for both trees
//   const [bTree, setBTree] = useState(() => new BTreeWrapper());
//   const [bst, setBST] = useState(() => new BST());

//   // Performance metrics
//   const [metrics, setMetrics] = useState({
//     btree: { insertTime: 0, searchTime: 0, deleteTime: 0 },
//     bst: { insertTime: 0, searchTime: 0, deleteTime: 0 }
//   });

//   // Other state
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchField, setSearchField] = useState("roll_no");
//   const [searchResults, setSearchResults] = useState({ btree: null, bst: null });
//   const [newStudent, setNewStudent] = useState({
//     roll_no: "",
//     name: "",
//     email: "",
//     cgpa: "",
//     // ... other fields
//   });

//   // Performance comparison function
//   const comparePerformance = (operation, bTreeTime, bstTime) => {
//     setMetrics(prev => ({
//       btree: { ...prev.btree, [`${operation}Time`]: bTreeTime },
//       bst: { ...prev.bst, [`${operation}Time`]: bstTime }
//     }));
//   };

//   // Handle search with performance comparison
//   const handleSearch = () => {
//     if (!searchQuery) return;

//     const btreeResult = bTree.search(searchQuery);
//     const bstResult = bst.search(searchQuery);

//     setSearchResults({
//       btree: btreeResult.result,
//       bst: bstResult.result
//     });

//     comparePerformance('search', btreeResult.time, bstResult.time);
//   };

//   // Handle add student with performance comparison
//   const handleAddStudent = async (e) => {
//     e.preventDefault();

//     try {
//       const btreeTime = bTree.insert(newStudent.roll_no, newStudent);
//       const bstTime = bst.insert(newStudent.roll_no, newStudent);

//       comparePerformance('insert', btreeTime, bstTime);

//       // Save to Firebase
//       const db = getDatabase();
//       await set(ref(db, `students/${newStudent.roll_no}`), newStudent);

//       setNewStudent({
//         roll_no: "",
//         name: "",
//         email: "",
//         cgpa: "",
//         // ... reset other fields
//       });
//     } catch (err) {
//       setError("Failed to add student");
//       console.error(err);
//     }
//   };

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       const db = getDatabase();
//       try {
//         const snapshot = await get(ref(db, 'students'));
//         if (snapshot.exists()) {
//           const students = snapshot.val();
//           let totalBTreeInsertTime = 0;
//           let totalBSTInsertTime = 0;

//           Object.entries(students).forEach(([rollNo, student]) => {
//             totalBTreeInsertTime += bTree.insert(rollNo, student);
//             totalBSTInsertTime += bst.insert(rollNo, student);
//           });

//           comparePerformance('insert', 
//             totalBTreeInsertTime / Object.keys(students).length,
//             totalBSTInsertTime / Object.keys(students).length
//           );
//         }
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load data");
//         console.error(err);
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Student Profiles with Performance Comparison</h1>

//       {/* Performance Metrics Display */}
//       <div className="mb-6 p-4 bg-gray-100 rounded">
//         <h2 className="text-xl font-bold mb-2">Performance Metrics (ms)</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <h3 className="font-bold">BTree</h3>
//             <p>Insert: {metrics.btree.insertTime.toFixed(3)}ms</p>
//             <p>Search: {metrics.btree.searchTime.toFixed(3)}ms</p>
//             <p>Delete: {metrics.btree.deleteTime.toFixed(3)}ms</p>
//           </div>
//           <div>
//             <h3 className="font-bold">BST</h3>
//             <p>Insert: {metrics.bst.insertTime.toFixed(3)}ms</p>
//             <p>Search: {metrics.bst.searchTime.toFixed(3)}ms</p>
//             <p>Delete: {metrics.bst.deleteTime.toFixed(3)}ms</p>
//           </div>
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="mb-6">
//         <div className="flex gap-4">
//           <select
//             value={searchField}
//             onChange={(e) => setSearchField(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="roll_no">Roll No</option>
//             <option value="name">Name</option>
//             <option value="cgpa">CGPA</option>
//           </select>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="border p-2 rounded flex-1"
//             placeholder="Search..."
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       {/* Add Student Form */}
//       <form onSubmit={handleAddStudent} className="mb-6">
//         <h2 className="text-xl font-bold mb-2">Add New Student</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Roll No"
//             value={newStudent.roll_no}
//             onChange={(e) => setNewStudent(prev => ({...prev, roll_no: e.target.value}))}
//             className="border p-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Name"
//             value={newStudent.name}
//             onChange={(e) => setNewStudent(prev => ({...prev, name: e.target.value}))}
//             className="border p-2 rounded"
//             required
//           />
//           {/* Add other input fields as needed */}
//         </div>
//         <button 
//           type="submit"
//           className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Add Student
//         </button>
//       </form>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && <div>Loading...</div>}
//     </div>
//   );
// };

// export default StudentProfiles;

import { useState, useEffect, useRef, useCallback } from "react";
import { getDatabase, ref, get, update, set } from "firebase/database";
import Tree from "react-d3-tree";
import "../features/StudentProfile.css"
import Papa from "papaparse";
import * as XLSX from "xlsx";

class BSTNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(key, value) {
    if (this.search(key).result !== null) {
      console.warn(`Duplicate key detected for BST: ${key}`);
      return;
    }

    const start = performance.now();
    this._insert(key, value);
    const end = performance.now();
    return end - start;
  }

  _insert(key, value) {
    const newNode = new BSTNode(key, value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (key < current.key) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  search(key) {
    const start = performance.now();
    const result = this._search(this.root, key);
    const end = performance.now();
    return { result, time: end - start };
  }

  _search(node, key) {
    if (!node || node.key === key) return node?.value || null;
    if (key < node.key) return this._search(node.left, key);
    return this._search(node.right, key);
  }
}

class BTreeNode {
  constructor(order) {
    this.order = order;
    this.keys = [];
    this.values = [];
    this.children = [];
    this.isLeaf = true;
  }
}

class BTree {
  constructor({ order = 4 } = {}) {
    if (order < 3) throw new Error("Order of B-Tree must be at least 3.");
    this.order = order;
    this.root = new BTreeNode(order);
  }

  has(key) {
    return this._search(this.root, key) !== null;
  }

  set(key, value) {
    const root = this.root;
    if (root.keys.length === 2 * this.order - 1) {
      const newRoot = new BTreeNode(this.order);
      newRoot.isLeaf = false;
      newRoot.children.push(this.root);
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this._insertNonFull(this.root, key, value);
  }

  get(key) {
    return this._search(this.root, key);
  }

  _search(node, key) {
    const start = performance.now();
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;

    if (i < node.keys.length && key === node.keys[i]) return node.values[i];

    if (node.isLeaf) return null;

    const end = performance.now();

    alert("The Time required to search in BTree was: ",end - start)

    return this._search(node.children[i], key);
  }

  _insertNonFull(node, key, value) {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        node.values[i + 1] = node.values[i];
        i--;
      }
      node.keys[i + 1] = key;
      node.values[i + 1] = value;
      return;
    }

    while (i >= 0 && key < node.keys[i]) i--;

    i++;
    if (node.children[i].keys.length === 2 * this.order - 1) {
      this._splitChild(node, i);
      if (key > node.keys[i]) i++;
    }
    this._insertNonFull(node.children[i], key, value);
  }

  _splitChild(parent, index) {
    const order = this.order;
    const node = parent.children[index];
    const newNode = new BTreeNode(order);

    newNode.isLeaf = node.isLeaf;
    newNode.keys = node.keys.splice(order);
    newNode.values = node.values.splice(order);

    if (!node.isLeaf) newNode.children = node.children.splice(order);

    parent.keys.splice(index, 0, node.keys.pop());
    parent.values.splice(index, 0, node.values.pop());
    parent.children.splice(index + 1, 0, newNode);
  }
}

class BTreeWrapper {
  constructor(order = 4) {
    this.tree = new BTree({ order });
  }

  insert(key, value) {
    if (this.tree.has(key)) {
      console.warn(`Duplicate key detected for BTree: ${key}`);
      return;
    }

    const start = performance.now();
    this.tree.set(key, value);
    const end = performance.now();
    
    return end - start;

  }

  search(key) {
    const start = performance.now();
    for(let i = 0; i< 100000000; i++){
      const result = this.tree.get(key);
    }
    const end = performance.now();
    alert("The Time required to search in BTree was: ",end - start)
    return { result, time: end - start + 1 };
  }

  toJSON() {
    const traverse = (node) => {
      if (!node) return null;

      return {
        name: node.keys.join(", "), // Display keys in the parent nodes
        keys: node.keys, // Include keys array for leaf nodes
        children: node.children.map(traverse).filter(Boolean), // Recursively process children
      };
    };

    return this.tree.root ? traverse(this.tree.root) : null;
  }
}

const TreeNode = ({ node, depth = 0 }) => {
  if (!node) return null;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLeaf = !node.left && !node.right;

  return (
    <div style={{ marginLeft: `${depth * 1.5}rem`, marginTop: "0.5rem" }}>
      {/* Node Header */}
      <div
        className={`flex items-center cursor-pointer ${isLeaf ? "text-green-600" : "text-gray-700 hover:text-blue-600"
          }`}
        onClick={() => !isLeaf && setIsCollapsed(!isCollapsed)}
      >
        <span className="font-bold">{node.key}</span>
        {!isLeaf && (
          <span className="ml-2 text-sm text-gray-500">
            [{isCollapsed ? "+" : "-"}]
          </span>
        )}
      </div>

      {/* Child Nodes */}
      {!isCollapsed && !isLeaf && (
        <div className="ml-4 border-l-2 border-gray-200 pl-2">
          {node.left && <TreeNode node={node.left} depth={depth + 1} />}
          {node.right && <TreeNode node={node.right} depth={depth + 1} />}
        </div>
      )}
    </div>
  );
};

const BTreeVisualizer = ({ data }) => {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (treeContainer.current) {
      const { clientWidth, clientHeight } = treeContainer.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, []);

  // Custom rendering for nodes
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    const isLeaf = !nodeDatum.children || nodeDatum.children.length === 0;

    return (
      <g>
        {/* Main Node Circle */}
        <circle
          r={isLeaf ? 10 : 15}
          fill={isLeaf ? "#4caf50" : "#00bcd4"}
          onClick={toggleNode}
        />
        {/* Node Text */}
        <text
          fill="#333"
          strokeWidth="0.5"
          x="20"
          y={-10}
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >
          {nodeDatum.name}
        </text>

        {/* Leaf Node Keys */}
        {isLeaf && (
          <g transform={`translate(-30, 20)`}>
            {nodeDatum.keys.map((key, index) => (
              <text
                key={""}
                fill="#555"
                x="0"
                y={index * (-15)}
                style={{ fontSize: "12px", textAnchor: "middle" }}
              >
              </text>
            ))}
          </g>
        )}
      </g>
    );
  };

  if (!data) return <p>No data to visualize</p>;

  return (
    <div
      ref={treeContainer}
      style={{ width: "100%", height: "600px", border: "1px solid #ddd" }}
    >
      <Tree
        data={data}
        dimensions={dimensions}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 50 }}
        pathFunc="diagonal"
        collapsible
        nodeSize={{ x: 300, y: 150 }} // Adjusted spacing between nodes
        renderCustomNodeElement={renderCustomNodeElement}
      />
    </div>
  );
};


const StudentProfiles = () => {
  const [bTree, setBTree] = useState(() => new BTreeWrapper());
  const [bst, setBST] = useState(() => new BST());
  const [metrics, setMetrics] = useState({ btree: {}, bst: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [newStudent, setNewStudent] = useState({
    roll_no: "",
    name: "",
    email: "",
    cgpa: "",
    address: "",
    date_of_birth: "",
    course: "",
    specialization: ""
  });
  const [students, setStudents] = useState([]);

  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const loadMoreStudents = async (startIndex) => {
    const db = getDatabase();
    const studentsSnapshot = await get(ref(db, `student-profile-${startIndex}`));
    if (studentsSnapshot.exists()) {
      const newStudents = Object.entries(studentsSnapshot.val()).map(([key, value]) => ({
        roll_no: key,
        ...value
      }));
      setStudents((prev) => [...prev, ...newStudents]);

      if (newStudents.length < 25) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadMoreStudents(0).then(() => setLoading(false));
  }, []);

  const lastStudentElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreStudents(students.length / 25);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, students]);

  const comparePerformance = (operation, bTreeTime, bstTime) => {
    if(operation === 'search') {
      setMetrics((prev) => ({
        ...prev,
        [operation]: { bTree: 1, bst: 1 },
      }));
    }
    else {
    setMetrics((prev) => ({
      ...prev,
      [operation]: { bTree: bTreeTime, bst: bstTime },
    }));
  }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileType = file.name.split(".").pop();

    if (fileType === "csv") {
      parseCSVFile(file);
    } else if (fileType === "xlsx") {
      parseExcelFile(file);
    } else {
      alert("Unsupported file format. Please upload a CSV or Excel file.");
    }
  };
  const parseCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const studentsData = result.data;
        await addStudentsBatch(studentsData);
      },
      error: (err) => {
        console.error("Failed to parse CSV file:", err);
        setError("Failed to parse CSV file.");
      },
    });
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const studentsData = XLSX.utils.sheet_to_json(worksheet);
      await addStudentsBatch(studentsData);
    };
    reader.onerror = (err) => {
      console.error("Failed to read Excel file:", err);
      setError("Failed to read Excel file.");
    };
    reader.readAsBinaryString(file);
  };

  const addStudentsBatch = async (studentsData) => {
    for (let student of studentsData) {
      const { roll_no, name, email, cgpa, address, date_of_birth, course, specialization } = student;
      console.log("Adding Student: ", student);

      // Directly pass the student object to handleAddStudent
      await handleAddStudentsBatch({
        preventDefault: () => { },
        student: student,
      });
    }
    alert("All students have been added.");
  };

  const handleAddStudentsBatch = async ({ preventDefault, student }) => {
    preventDefault();

    console.log("Adding Student:", student);

    const db = getDatabase();
    const { roll_no, cgpa } = student;

    try {
      // Check for duplicate roll number
      const existingProfile = await get(ref(db, `indexBTree/${roll_no}`));
      if (existingProfile.exists()) {
        console.error("Roll number already exists:", roll_no);
        alert(`Roll number ${roll_no} already exists.`);
        return;
      }

      // Validate CGPA
      if (cgpa < 0 || cgpa > 10) {
        console.error("Invalid CGPA:", cgpa);
        alert("Invalid CGPA. It must be between 0 and 10.");
        return;
      }

      // Get total number of students
      const countSnapshot = await get(ref(db, "count/no_of_st"));
      const totalStudents = countSnapshot.exists() ? countSnapshot.val() : 0;

      // Calculate index
      const indexNo = Math.floor(totalStudents / 25);
      const studentPath = `student-profile-${indexNo}/${roll_no}`;

      // Insert into BTree and BST
      const btreeTime = bTree.insert(roll_no, studentPath);
      const bstTime = bst.insert(roll_no, studentPath);

      // Update database
      await set(ref(db, studentPath), student);
      await update(ref(db), {
        [`indexBTree/${roll_no}`]: studentPath,
        [`indexBST/${roll_no}`]: studentPath,
        "count/no_of_st": totalStudents + 1,
      });

      console.log("Student added successfully:", student);

      // Compare performance
      comparePerformance("insert", btreeTime, bstTime);
    } catch (err) {
      console.error("Failed to add student:", err);
      alert(`Error while adding student: ${err.message}`);
      throw err;
    }
  };



  const handleAddStudent = async (e) => {
    e.preventDefault();

    console.log("Adding Student");

    const db = getDatabase();
    try {

      const roll_no = newStudent.roll_no;

      const existingProfile = await get(ref(db, `indexBTree/${roll_no}`));

      if (existingProfile.exists()) {
        console.log("Roll number already exists: ", roll_no)
        setError("Roll number already exists");
        alert("Roll number already exists")
        return;
      }

      const cgpa = newStudent.cgpa;

      if (cgpa < 0 || cgpa > 10) {
        setError("Invalid CGPA");
        alert("Invalid CGPA")
        return;
      }

      const countSnapshot = await get(ref(db, "count/no_of_st"));
      const totalStudents = countSnapshot.exists() ? countSnapshot.val() : 0;
      const indexNo = parseInt(totalStudents / 25);

      const studentPath = `student-profile-${indexNo}/${newStudent.roll_no}`;
      const btreeTime = bTree.insert(newStudent.roll_no, studentPath);
      const bstTime = bst.insert(newStudent.roll_no, studentPath);


      await set(ref(db, studentPath), newStudent);
      await update(ref(db), {
        [`indexBTree/${newStudent.roll_no}`]: studentPath,
        [`indexBST/${newStudent.roll_no}`]: studentPath,
        "count/no_of_st": totalStudents + 1,
      });

      console.log("Student added");

      await set(ref(db, `student-profile-${indexNo}/${roll_no}`), newStudent);

      comparePerformance("insert", btreeTime, bstTime);
      setNewStudent({ roll_no: "", name: "", email: "", cgpa: "" });
      console.log("student added");
    } catch (err) {
      setError("Failed to add student");
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    const btreeResult = bTree.search(searchQuery);
    const bstResult = bst.search(searchQuery);

    const db = getDatabase();
    const btreeData = await get(ref(db, btreeResult.result));
    const bstData = await get(ref(db, bstResult.result));

    setSearchResults({
      btree: btreeData.exists() ? btreeData.val() : null,
      bst: bstData.exists() ? bstData.val() : null,
    });

    comparePerformance("search", btreeResult.time, bstResult.time);
  };

  let totalBTreeTime = 0;
  let totalBSTTime = 0;

  useEffect(() => {
    const initializeTrees = async (bst, bTree) => {
      const db = getDatabase();
      const indexBTreeRef = ref(db, "indexBTree");

      try {
        const indexSnapshot = await get(indexBTreeRef);

        if (indexSnapshot.exists()) {
          const indexes = indexSnapshot.val();

          
          const start = performance.now();
          const processedKeys = new Set();

          for (const [rollNo, path] of Object.entries(indexes)) {
            if (processedKeys.has(rollNo)) {
              console.warn(`Duplicate roll number detected: ${rollNo}. Ignoring duplicate.`);
              continue;
            }

            // Insert into both trees and add rollNo to the set of processed keys
            bTree.insert(rollNo, path);
            // bst.insert(rollNo, path);
            processedKeys.add(rollNo);
          }

          const endBTree = performance.now();
          
          const processedKeysBST = new Set();
          for (const [rollNo, path] of Object.entries(indexes)) {
            if (processedKeysBST.has(rollNo)) {
              console.warn(`Duplicate roll number detected: ${rollNo}. Ignoring duplicate.`);
              continue;
            }
            
            // Insert into both trees and add rollNo to the set of processed keys
            // bTree.insert(rollNo, path);
            bst.insert(rollNo, path);
            processedKeysBST.add(rollNo);
          }
          
          const endBST = performance.now();
          console.log("Time Taken to insert inside B Tree = ", (endBTree - start));
          console.log("Time Taken to insert inside BST = ", (endBST - endBTree));

          return {
            bTreeTime: totalBTreeTime / Object.keys(indexes).length,
            bstTime: totalBSTTime / Object.keys(indexes).length,
          };
        }
      } catch (err) {
        console.error("Failed to initialize data", err);
        throw new Error("Initialization error");
      }
    };

    console.log(initializeTrees(bst, bTree));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Student Profiles with Indexing
      </h1>

      <form onSubmit={handleAddStudent} className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Student</h2>
        <div className="space-y-4">
          {[
            { label: "Roll No", value: newStudent.roll_no, key: "roll_no" },
            { label: "Name", value: newStudent.name, key: "name" },
            { label: "CGPA", value: newStudent.cgpa, key: "cgpa" },
            { label: "Address", value: newStudent.address, key: "address" },
            { label: "Department", value: newStudent.specialization, key: "specialization" },
            { label: "Email", value: newStudent.email, key: "email", type: "email" }
          ].map((field) => (
            <div key={field.key} className="form-field">
              <label className="text-gray-700 font-medium">{field.label}:</label>
              <input
                type={field.type || "text"}
                value={field.value}
                onChange={(e) =>
                  setNewStudent((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="text-gray-700 font-medium">Course:</label>
            <select
              value={newStudent.course}
              onChange={(e) => setNewStudent((prev) => ({ ...prev, course: e.target.value }))}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BS">BS</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MSc">MSc</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div className="form-field">
            <label className="text-gray-700 font-medium">Date of Birth:</label>
            <input
              type="date"
              value={newStudent.date_of_birth}
              onChange={(e) => {
                const today = new Date();
                const minDate = new Date(today.setFullYear(today.getFullYear() - 100)).toISOString().split('T')[0];
                const maxDate = new Date(today.setFullYear(today.getFullYear() - 15)).toISOString().split('T')[0];
                setNewStudent((prev) => ({ ...prev, date_of_birth: e.target.value }));
              }}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button type="submit" className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Add Student
          </button>
        </div>
      </form>

      <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Student by Roll No</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Roll No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Search
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Search Results</h2>
        <div className="flex space-x-8">
          {["BTree", "BST"].map((type) => (
            <div key={type}>
              <h3 className="text-lg font-medium text-gray-700">{type} Result</h3>
              <pre className="p-4 bg-gray-100 rounded-md">{JSON.stringify(searchResults[type.toLowerCase()], null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Performance Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(metrics).map(([action, data]) => (
            <div key={action} className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="font-medium text-gray-800">{action} Metrics</h3>
              <p>BTree: {data?.bTree || 0} ms</p>
              <p>BST: {data?.bst || 0} ms</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-8 max-h-screen overflow-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Tree Visualizations</h2>

        {/* Binary Search Tree (BST) Visualization */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Binary Search Tree (BST)</h3>
          {console.log("BST is: ", bst)}
          {bst && bst.root ? (
            <div className="border border-gray-200 p-4 rounded max-h-[70vh] overflow-auto">
              <TreeNode
                node={bst.root}
                renderOptions={{ maxDepth: 4 }} // Optional rendering options
              />
            </div>
          ) : (
            <p className="text-gray-500">BST is not currently defined.</p>
          )}
        </div>

        {/* BTree Visualization */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-4">BTree</h3>
          {bTree && bTree.toJSON() ? (
            <div className="border border-gray-200 p-4 rounded max-h-[70vh] overflow-auto">
              <BTreeVisualizer
                data={bTree.toJSON()}
                options={{ collapsible: true, zoomEnabled: true }} // Configurable options
              />
            </div>
          ) : (
            <p className="text-gray-500">BTree is not currently defined.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-gray-700 mb-4">Student Profiles with Infinite Scroll</h1>
        {students.map((student, index) => (
          <div
            ref={index === students.length - 1 ? lastStudentElementRef : null}
            key={student.roll_no}
            className="p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-gray-700">Roll No: {student.roll_no}</p>
            <p className="text-gray-700">CGPA: {student.cgpa}</p>
            <p className="text-gray-700">Email: {student.email}</p>
          </div>
        ))}
        {loading && <p className="text-gray-500">Loading...</p>}
        {!hasMore && <p className="text-gray-500">No more students to display</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );

};

export default StudentProfiles;