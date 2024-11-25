export const preprocessData = (data) => {
  const salesDate = [];
  const productDescription = [];
  const quantitySold = [];

  const productMap = {}; // Map to dynamically encode product names
  let productIndex = 0;

  data.forEach((row, index) => {
    if (!row.sales_date || !row.product_description || !row.quantity_sold) {
      console.error(`Row ${index + 1} has missing or invalid data:`, row);
      return;
    }

    const [year, month] = row.sales_date.split("-");
    if (!year || !month) {
      console.error(`Invalid sales_date format in row ${index + 1}:`, row.sales_date);
      return;
    }

    // Encode product names dynamically
    if (!(row.product_description in productMap)) {
      productMap[row.product_description] = productIndex++;
    }

    salesDate.push(parseInt(month));
    productDescription.push(productMap[row.product_description]);
    quantitySold.push(parseInt(row.quantity_sold));
  });

  console.log("Processed Data:", {
    salesDate,
    productDescription,
    quantitySold,
  });

  // Normalize quantity_sold
  const max = Math.max(...quantitySold);
  const min = Math.min(...quantitySold);
  const normalizedQuantity = quantitySold.map((val) => (val - min) / (max - min));

  return {
    salesDate,
    productDescription,
    normalizedQuantity,
    max,
    min,
  };
};
