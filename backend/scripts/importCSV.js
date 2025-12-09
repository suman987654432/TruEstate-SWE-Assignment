import sql from 'mssql';
import { connectDB, closeDB } from '../config/database.js';
import dotenv from "dotenv";
dotenv.config();
async function importExcel() {
  let pool;
  try {
    console.log(' Connecting to MSSQL...\n');
    pool = await connectDB();

    await pool.request().query('DELETE FROM Sales');
    console.log(" Old data deleted");

    const workbook = xlsx.readFile("test.CSV");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log(` Total rows in CSV: ${rows.length}`);

    let totalInserted = 0;
    let skippedRows = 0;
    const batchSize = 100;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      const table = new sql.Table('Sales');
      table.columns.add('transactionId', sql.Int, { nullable: false });
      table.columns.add('customerId', sql.NVarChar(50), { nullable: true });
      table.columns.add('customerName', sql.NVarChar(255), { nullable: true });
      table.columns.add('phoneNumber', sql.NVarChar(20), { nullable: true });
      table.columns.add('gender', sql.NVarChar(10), { nullable: true });
      table.columns.add('age', sql.Int, { nullable: true });
      table.columns.add('customerRegion', sql.NVarChar(100), { nullable: true });
      table.columns.add('customerType', sql.NVarChar(50), { nullable: true });
      table.columns.add('productId', sql.NVarChar(50), { nullable: true });
      table.columns.add('productName', sql.NVarChar(255), { nullable: true });
      table.columns.add('brand', sql.NVarChar(100), { nullable: true });
      table.columns.add('productCategory', sql.NVarChar(100), { nullable: true });
      table.columns.add('tags', sql.NVarChar(sql.MAX), { nullable: true });
      table.columns.add('quantity', sql.Int, { nullable: true });
      table.columns.add('pricePerUnit', sql.Decimal(18, 2), { nullable: true });
      table.columns.add('discountPercentage', sql.Decimal(5, 2), { nullable: true });
      table.columns.add('totalAmount', sql.Decimal(18, 2), { nullable: true });
      table.columns.add('finalAmount', sql.Decimal(18, 2), { nullable: true });
      table.columns.add('saleDate', sql.DateTime, { nullable: true });
      table.columns.add('paymentMethod', sql.NVarChar(50), { nullable: true });
      table.columns.add('orderStatus', sql.NVarChar(50), { nullable: true });
      table.columns.add('deliveryType', sql.NVarChar(50), { nullable: true });
      table.columns.add('storeId', sql.NVarChar(50), { nullable: true });
      table.columns.add('storeLocation', sql.NVarChar(255), { nullable: true });
      table.columns.add('salespersonId', sql.NVarChar(50), { nullable: true });
      table.columns.add('employeeName', sql.NVarChar(255), { nullable: true });

      for (const r of batch) {
        if (!r["Transaction ID"]) {
          skippedRows++;
          continue;
        }

        const get = (obj, key) => obj[key] ?? "";

        let dateValue = new Date(get(r, "Date"));
        if (isNaN(dateValue) && get(r, "Date")) {
          const parts = String(get(r, "Date")).split("-");
          if (parts.length === 3) {
            dateValue = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        if (isNaN(dateValue)) {
          dateValue = new Date();
        }

        const tags = get(r, "Tags") ? String(get(r, "Tags")).split(",").map(t => t.trim()).join(',') : '';

        table.rows.add(
          Number(get(r, "Transaction ID")) || 0,
          get(r, "Customer ID") || null,
          get(r, "Customer Name") || null,
          String(get(r, "Phone Number")) || null,
          get(r, "Gender") || null,
          Number(get(r, "Age")) || null,
          get(r, "Customer Region") || null,
          get(r, "Customer Type") || null,
          get(r, "Product ID") || null,
          get(r, "Product Name") || null,
          get(r, "Brand") || null,
          get(r, "Product Category") || null,
          tags || null,
          Number(get(r, "Quantity")) || null,
          Number(get(r, "Price per Unit")) || null,
          Number(get(r, "Discount Percentage")) || null,
          Number(get(r, "Total Amount")) || null,
          Number(get(r, "Final Amount")) || null,
          dateValue,
          get(r, "Payment Method") || null,
          get(r, "Order Status") || null,
          get(r, "Delivery Type") || null,
          get(r, "Store ID") || null,
          get(r, "Store Location") || null,
          get(r, "Salesperson ID") || null,
          get(r, "Employee Name") || null
        );
      }

      if (table.rows.length > 0) {
        try {
          const request = pool.request();
          await request.bulk(table);
          totalInserted += table.rows.length;
          const progress = ((totalInserted / rows.length) * 100).toFixed(1);
          console.log(` Batch inserted: ${table.rows.length.toLocaleString()} | Total: ${totalInserted.toLocaleString()} (${progress}%)`);
        } catch (err) {
          console.error(` Batch insert error:`, err.message);
        }
      }
    }

    const result = await pool.request().query('SELECT COUNT(*) as count FROM Sales');
    const count = result.recordset[0].count;

    console.log(`\n Summary:`);
    console.log(`   Total rows in CSV: ${rows.length.toLocaleString()}`);
    console.log(`   Skipped rows: ${skippedRows.toLocaleString()}`);
    console.log(`   Records inserted: ${totalInserted.toLocaleString()}`);
    console.log(`   Documents in DB: ${count.toLocaleString()}`);

    console.log("\n Import Completed Successfully!");
    await closeDB();
    process.exit(0);

  } catch (error) {
    console.error(" ERROR:", error);
    if (pool) {
      await closeDB();
    }
    process.exit(1);
  }
}

importExcel();
