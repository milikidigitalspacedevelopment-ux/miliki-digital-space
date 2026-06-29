import {
  useEffect,
  useState
} from "react";

function useFetch(
  callback,
  dependencies = []
) {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    async function fetchData() {

      try {

        const result =
          await callback();

        setData(result);

      }

      catch (err) {

        setError(err);

      }

      finally {

        setLoading(false);

      }

    }

    fetchData();

  }, dependencies);

  return {
    data,
    loading,
    error
  };

}

export default useFetch;