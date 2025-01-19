const axios = require('axios');

const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
};

module.exports = fetchData;
