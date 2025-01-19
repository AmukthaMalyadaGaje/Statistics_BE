const Transaction = require('../models/Transaction');

const initializeDatabase = async (data) => {
    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(data);
};

const getTransactions = async (query, page, perPage) => {
    const searchQuery = query
        ? {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { price: { $regex: query, $options: 'i' } },
            ],
        }
        : {};
    const transactions = await Transaction.find(searchQuery)
        .skip((page - 1) * perPage)
        .limit(perPage);
    const total = await Transaction.countDocuments(searchQuery);
    return { transactions, total };
};

const getStatistics = async (month, year) => {
    console.log("month", month, "year", year);

    // Ensure the month is a valid number between 1 and 12 and year is a valid number
    if (month < 1 || month > 12) {
        throw new Error("Invalid month. It should be between 1 and 12.");
    }

    // Default year to 2022 if not passed
    const targetYear = year || 2022;

    // Create the start and end dates for the selected month and year
    const startDate = new Date(targetYear, month - 1, 1); // month - 1 to account for zero-indexed months
    const endDate = new Date(targetYear, month, 1); // The first day of the next month

    // Query the database to count sold and not sold items in the selected month and year
    const [soldItems, notSoldItems] = await Promise.all([
        Transaction.countDocuments({ sold: true, dateOfSale: { $gte: startDate, $lt: endDate } }),
        Transaction.countDocuments({ sold: false, dateOfSale: { $gte: startDate, $lt: endDate } }),
    ]);

    // Aggregate the total sales amount for the selected month and year
    const totalSales = await Transaction.aggregate([
        { $match: { sold: true, dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    // Return the statistics
    return {
        totalSales: totalSales[0]?.total || 0,
        soldItems,
        notSoldItems
    };
};


const getBarChart = async (month) => {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(`2022-${month + 1}-01`);
    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901 },
    ];

    const chartData = await Promise.all(
        priceRanges.map(async ({ range, min, max }) => {
            const count = await Transaction.countDocuments({
                price: { $gte: min, ...(max ? { $lte: max } : {}) },
                dateOfSale: { $gte: startDate, $lt: endDate },
            });
            return { range, count };
        })
    );

    return chartData;
};

const getPieChart = async (month) => {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(`2022-${month + 1}-01`);
    const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    return categories.map((cat) => ({ category: cat._id, count: cat.count }));
};

module.exports = { initializeDatabase, getTransactions, getStatistics, getBarChart, getPieChart };
