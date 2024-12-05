import React, { useState } from 'react';

const InputForm = ({ setData, setMaxStudents }) => {
  const [localMaxStudents, setLocalMaxStudents] = useState(30); // Local state for maxStudents

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split("\n").map((line) => line.trim()); // Trim lines to remove extra spaces

        // Extract header and validate structure
        const [header, ...rows] = lines;
        const headers = header.split(",").map((h) => h.trim());

        // Check for required headers
        if (
          !headers.includes("Semester") ||
          !headers.includes("Course Code") ||
          !headers.includes("Total Students Enrolled")
        ) {
          alert("CSV file format is incorrect. Please check your headers.");
          return;
        }

        // Parse rows into objects
        const parsedData = rows
          .filter((line) => line) // Ignore empty lines
          .map((row) => {
            const values = row.split(",").map((v) => v.trim());
            const semester = values[0] || "N/A";
            const courseCode = values[1] || "N/A";
            const totalStudents = parseInt(values[2], 10);

            return {
              semester,
              courseCode,
              totalStudents: isNaN(totalStudents) ? 0 : totalStudents,
            };
          });

        console.log("Parsed Data:", parsedData); // Debugging
        setData(parsedData); // Set parsed data
      };
      reader.readAsText(file); // Read the file content
    }
  };

  return (
    <div className="mb-4">
      {/* File Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="form-control mb-3"
      />

      {/* Max Students Input */}
      <input
        type="number"
        value={localMaxStudents}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          setLocalMaxStudents(value); // Update local state
          setMaxStudents(value); // Update parent state
        }}
        className="form-control"
        placeholder="Max Students per Section"
      />
    </div>
  );
};

export default InputForm;
