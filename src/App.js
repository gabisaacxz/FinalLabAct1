import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Visualization from "./components/Visualization";
import { preprocessData } from "./components/DataPreprocessing";
import { trainModel } from "./components/ModelTraining";
import { forecastSales } from "./components/Forecasting";

const App = () => {
  const [data, setData] = useState(null);
  const [model, setModel] = useState(null);
  const [predictedSales, setPredictedSales] = useState([]);
  const [desiredProduct, setDesiredProduct] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);

  const handleDataLoaded = (rawData) => {
    const processedData = preprocessData(rawData);

    // Extract unique product names from the data
    const uniqueProducts = Array.from(
      new Set(rawData.map((row) => row.product_description))
    );
    setAvailableProducts(uniqueProducts);
    setData(processedData);
  };

  const handleTrainModel = async () => {
    if (!data || !desiredProduct) {
      alert("Please upload data and enter a valid product name.");
      return;
    }
  
    if (!availableProducts.includes(desiredProduct)) {
      alert(`The product "${desiredProduct}" does not exist in the uploaded data.`);
      return;
    }
  
    const filteredData = {
      ...data,
      productDescription: data.productDescription.filter(
        (desc, index) => desc === availableProducts.indexOf(desiredProduct)
      ),
      salesDate: data.salesDate.filter(
        (_, index) =>
          data.productDescription[index] === availableProducts.indexOf(desiredProduct)
      ),
      normalizedQuantity: data.normalizedQuantity.filter(
        (_, index) =>
          data.productDescription[index] === availableProducts.indexOf(desiredProduct)
      ),
    };
  
    if (filteredData.salesDate.length === 0) {
      alert(`No data available for product "${desiredProduct}".`);
      return;
    }
  
    const trainedModel = await trainModel(filteredData);
    setModel(trainedModel);
  
    const predictions = forecastSales(trainedModel, filteredData);
    setPredictedSales(predictions);
  };
  

  return (
    <div>
      <h1>Sales Forecasting</h1>
      <FileUpload onDataLoaded={handleDataLoaded} />

      <div>
        <label>Enter Product Name: </label>
        <input
          type="text"
          value={desiredProduct}
          onChange={(e) => setDesiredProduct(e.target.value)}
        />
      </div>

      <button onClick={handleTrainModel}>Train Model</button>

      {data && (
        <Visualization
          actualData={data.normalizedQuantity.map(
            (val) => val * (data.max - data.min) + data.min
          )}
          predictedData={predictedSales}
        />
      )}
    </div>
  );
};

export default App;
