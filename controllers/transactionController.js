const fetchData = require('../utils/fetchData');
const service = require('../services/transactionService');

const initializeDatabase = async (req, res) => {
    try {
        const data = await fetchData('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await service.initializeDatabase(data);
        res.status(200).send({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const { query, page = 1, perPage = 10 } = req.query;
        const data = await service.getTransactions(query, +page, +perPage);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const stats = await service.getStatistics(month);
        res.status(200).send(stats);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getBarChart = async (req, res) => {
    try {
        const { month } = req.query;
        const chartData = await service.getBarChart(month);
        res.status(200).send(chartData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getPieChart = async (req, res) => {
    try {
        const { month } = req.query;
        const pieData = await service.getPieChart(month);
        res.status(200).send(pieData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { initializeDatabase, getTransactions, getStatistics, getBarChart, getPieChart };
