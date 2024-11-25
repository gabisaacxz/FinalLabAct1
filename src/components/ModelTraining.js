import * as tf from "@tensorflow/tfjs";

export const trainModel = async (data) => {
  const { salesDate, productDescription, normalizedQuantity } = data;

  // Create tensors
  const inputs = tf.tensor2d(
    salesDate.map((date, index) => [date, productDescription[index]])
  );
  const outputs = tf.tensor2d(normalizedQuantity.map((value) => [value]));

  // Define the model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [2], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  // Train the model
  await model.fit(inputs, outputs, { epochs: 50, batchSize: 10 });
  return model;
};
