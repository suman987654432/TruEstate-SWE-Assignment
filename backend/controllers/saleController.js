import sql from 'mssql';
import { poolPromise } from '../config/db.js';
const transformSaleData = (row) => ({
  _id: row.Transaction_ID,
  transactionId: row.Transaction_ID,
  customer: {
    id: row.Customer_ID,
    name: row.Customer_Name,
    phone: row.Phone_Number,
    gender: row.Gender,
    age: row.Age,
    region: row.Customer_Region,
    type: row.Customer_Type
  },
  product: {
    id: row.Product_ID,
    name: row.Product_Name,
    brand: row.Brand,
    category: row.Product_Category,
    tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : []
  },
  sales: {
    quantity: row.Quantity,
    pricePerUnit: row.Price_per_Unit,
    discountPercentage: row.Discount_Percentage,
    totalAmount: row.Total_Amount,
    finalAmount: row.Final_Amount
  },
  operational: {
    date: row.Date,
    paymentMethod: row.Payment_Method,
    orderStatus: row.Order_Status,
    deliveryType: row.Delivery_Type,
    storeId: row.Store_ID,
    storeLocation: row.Store_Location,
    salespersonId: row.Salesperson_ID,
    employeeName: row.Employee_Name
  }
});


export const getSales = async (req, res) => {
  try {
    console.log('📊 Fetching sales data...');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const sortOrder = req.query.sortOrder || 'ASC';

    console.log(`📄 Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    const pool = await poolPromise;
    console.log('✅ Pool connected');


    const countResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM dbo.sales');
    const total = countResult.recordset[0].total;
    console.log(`📈 Total records: ${total}`);


    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT * FROM dbo.sales
        ORDER BY Transaction_ID ${sortOrder}
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    console.log(`✅ Fetched ${result.recordset.length} rows for page ${page} (limit: ${limit})`);


    const transformedData = result.recordset.map(transformSaleData);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: transformedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(' Error:', error.message);
    console.log(' Full error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};


export const getSalesStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        COUNT(*) as totalSales,
        SUM(Final_Amount) as totalRevenue,
        AVG(Final_Amount) as averagePrice,
        SUM(Quantity) as totalQuantity,
        COUNT(DISTINCT Customer_ID) as totalCustomers,
        COUNT(DISTINCT Product_Category) as totalCategories
      FROM dbo.sales
    `);

    const categoryResult = await pool.request().query(`
      SELECT 
        Product_Category,
        COUNT(*) as salesCount,
        SUM(Final_Amount) as totalRevenue,
        SUM(Quantity) as totalQuantity
      FROM dbo.sales
      GROUP BY Product_Category
      ORDER BY totalRevenue DESC
    `);

    const paymentMethodResult = await pool.request().query(`
      SELECT 
        Payment_Method,
        COUNT(*) as count,
        SUM(Final_Amount) as totalRevenue
      FROM dbo.sales
      GROUP BY Payment_Method
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        overall: result.recordset[0],
        categoryStats: categoryResult.recordset,
        paymentMethods: paymentMethodResult.recordset
      }
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.BigInt, id)
      .query('SELECT * FROM dbo.sales WHERE Transaction_ID = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transformedData = transformSaleData(result.recordset[0]);

    res.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.log(' Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
