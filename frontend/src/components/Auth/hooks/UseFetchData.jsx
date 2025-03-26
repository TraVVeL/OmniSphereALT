import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}`);
                console.log(response.data);
                setData(response.data);
            } catch (err) {
                const errors = err.response.data.errors;
                setError(errors);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => setData(null);
    }, [url]);

    return { data, loading, error };
};

export default useFetchData;
