import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const TrainModelButton = ({ data, setModel, setOutputMax, setOutputMin }) => {
  const [isTraining, setIsTraining] = useState(false);

  const trainModel = async () => {
    if (!data || data.length === 0) {
      alert("Please upload data first.");
      return;
    }

    const inputs = data.map((d) => d.totalStudents);
    const outputs = inputs.map((i) => i * 1.2); // Replace with actual logic if needed

    const inputMax = Math.max(...inputs);
    const inputMin = Math.min(...inputs);
    const outputMax = Math.max(...outputs);
    const outputMin = Math.min(...outputs);

    const normalizedInputs = inputs.map((i) => (i - inputMin) / (inputMax - inputMin));
    const normalizedOutputs = outputs.map((o) => (o - outputMin) / (outputMax - outputMin));

    const inputTensor = tf.tensor2d(normalizedInputs, [normalizedInputs.length, 1]);
    const outputTensor = tf.tensor2d(normalizedOutputs, [normalizedOutputs.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });

    setIsTraining(true);

    await model.fit(inputTensor, outputTensor, {
      epochs: 100,
      batchSize: 16,
      shuffle: true,
    });

    setModel(model);
    setOutputMax(outputMax);
    setOutputMin(outputMin);

    inputTensor.dispose();
    outputTensor.dispose();
    setIsTraining(false);

    alert("Model trained successfully!");
  };

  return (
    <button onClick={trainModel} className="btn btn-primary" disabled={isTraining}>
      {isTraining ? 'Training...' : 'Train Model'}
    </button>
  );
};

export default TrainModelButton;
