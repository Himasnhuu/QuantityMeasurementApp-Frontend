import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getToken();

        // ❗ If no token → don't call API
        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch("http://localhost:8080/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ❗ Handle unauthorized / error
        if (!res.ok) {
          console.error("Error:", res.status);

          if (res.status === 401) {
            console.log("Unauthorized - please login again");
          }

          return;
        }

        const data = await res.json();
        setHistory(data);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your History</h2>

      {history.length === 0 ? (
        <p>No history found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Operand 1</th>
              <th>Operand 2</th>
              <th>Result</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.operation}</td>
                <td>{item.operand1}</td>
                <td>{item.operand2}</td>
                <td>{item.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoryPage;