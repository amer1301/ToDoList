import {useState, useEffect } from "react";

export default function useGet<T>(url : string) : {
   data: T,
   error: string | null,
   loading: boolean,
   fetchData: () => void
} {

      const [data, setData] = useState<T>([] as T);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      
      useEffect(() => {
      fetchData();
      }, [])
    
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null)
    
          const res = await fetch(url);
    
          if(res.ok) {
            const data = await res.json();
            setData(data);
          }
    
        } catch (error) {
          setError("Det blev fel, försök igen...");
        } finally {
          setLoading(false);
        }
      }

    return {data, error, loading, fetchData}
}