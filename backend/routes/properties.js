const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../database/db');
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const countResult = await pool.request()
            .query('SELECT COUNT(*) as total FROM dbo.sales');
        const total = countResult.recordset[0].total;

        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
                SELECT * FROM dbo.sales
                ORDER BY Transaction_ID DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        console.log('Query successful, rows:', result.recordset.length);

        res.json({
            success: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: result.recordset
        });
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).json({
            error: 'Database query failed',
            details: err.message,
            hint: 'Check /api/properties/debug/tables to see available tables'
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.BigInt, req.params.id)
            .query('SELECT * FROM dbo.sales WHERE Transaction_ID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).json({
            error: 'Database query failed',
            details: err.message
        });
    }
});

module.exports = router;