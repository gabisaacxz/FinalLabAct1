import * as tf from"@tensorflow/tfjs";

export const forecastSales = (model, data) => {
    const { max, min } = data;
  
    // Predict for the next 6 months
    const futureInputs = tf.tensor2d(
      Array.from({ length: 6 }, (_, i) => [i + 1, 0]) // Assuming Product A for simplicity
    );
    const predictions = model.predict(futureInputs).dataSync();
  
    // Denormalize predictions
    return predictions.map((val) => val * (max - min) + min);
  };