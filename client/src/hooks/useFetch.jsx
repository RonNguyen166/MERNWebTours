import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setResult(res.data);
      } catch (err) {
        setError(err.response.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setResult(res.data);
    } catch (err) {
      setError(err.response.data);
    }
    setLoading(false);
  };

  return { result, loading, error, reFetch };
};

export default useFetch;
