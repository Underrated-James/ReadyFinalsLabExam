import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import InputForm from './components/InputForm';
import TrainModelButton from './components/TrainModelButton';
import PredictionTable from './components/PredictionTable';
import Visualization from './components/Visualization';
import './App.css';

const App = () => {
  const [data, setData] = useState([]); // Uploaded data
  const [maxStudents, setMaxStudents] = useState(30); // Max students per section
  const [model, setModel] = useState(null); // TensorFlow model
  const [predictions, setPredictions] = useState([]); // Prediction results
  const [outputMax, setOutputMax] = useState(1); // Max output value for normalization
  const [outputMin, setOutputMin] = useState(0); // Min output value for normalization

  // Function to generate new predictions
  const generatePredictions = () => {
    if (!model) {
      alert("Model is not trained. Please train the model first.");
      return;
    }

    if (data.length === 0) {
      alert("No data uploaded. Please upload a CSV file.");
      return;
    }

    const newPredictions = data.map((d) => {
      if (isNaN(d.totalStudents) || d.totalStudents <= 0) {
        console.warn("Invalid data row:", d);
        return {
          ...d,
          predictedEnrollment: "Invalid Data",
          sectionsNeeded: "Invalid Data",
        };
      }

      try {
        // Normalize input
        const normalizedInput = (d.totalStudents - outputMin) / (outputMax - outputMin);
        const tensorInput = tf.tensor2d([normalizedInput], [1, 1]);

        // Get model prediction
        const tensorPrediction = model.predict(tensorInput);
        const predictionArray = tensorPrediction.dataSync();

        // Denormalize output
        const predictedEnrollment = predictionArray[0] * (outputMax - outputMin) + outputMin;

        // Calculate sections needed
        const sectionsNeeded = Math.ceil(predictedEnrollment / maxStudents);

        // Clean up tensors
        tensorInput.dispose();
        tensorPrediction.dispose();

        return { ...d, predictedEnrollment, sectionsNeeded };
      } catch (error) {
        console.error("Error during prediction:", error);
        return {
          ...d,
          predictedEnrollment: "Error",
          sectionsNeeded: "Error",
        };
      }
    });

    // Update state with new predictions
    setPredictions(newPredictions);
    console.log("Generated Predictions:", newPredictions); // Debugging purposes
  };

  return (
    <div className="container mt-4">
      <h1>Course Section Forecasting System</h1>
      <InputForm setData={setData} setMaxStudents={setMaxStudents} />
      <TrainModelButton
        data={data}
        setModel={setModel}
        setOutputMax={setOutputMax}
        setOutputMin={setOutputMin}
      />
      <button onClick={generatePredictions} className="btn btn-success mt-3">
        Generate Predictions
      </button>
      <PredictionTable predictions={predictions} />
      <Visualization data={predictions} />
    </div>
  );
};

export default App;
