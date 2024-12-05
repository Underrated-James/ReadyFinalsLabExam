import React from 'react';

const PredictionTable = ({ predictions }) => {
  console.log("Prediction Table Data:", predictions); // Debugging

  if (!predictions || predictions.length === 0) {
    return <p>No predictions to display. Please upload data and generate predictions.</p>;
  }

  return (
    <table className="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Predicted Enrollment</th>
          <th>Sections Needed</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((prediction, index) => {
          const courseCode = prediction?.courseCode || "N/A";
          const predictedEnrollment = prediction?.predictedEnrollment;
          const sectionsNeeded = prediction?.sectionsNeeded;

          return (
            <tr key={index}>
              <td>{courseCode}</td>
              <td>
                {predictedEnrollment !== undefined &&
                !isNaN(predictedEnrollment) &&
                predictedEnrollment !== "Invalid Data"
                  ? predictedEnrollment.toFixed(2)
                  : "N/A"}
              </td>
              <td>
                {sectionsNeeded !== undefined &&
                !isNaN(sectionsNeeded) &&
                sectionsNeeded !== "Invalid Data"
                  ? sectionsNeeded
                  : "N/A"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PredictionTable;
