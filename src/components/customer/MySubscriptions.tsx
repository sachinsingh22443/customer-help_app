import { useEffect, useState } from "react";

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://chef-backend-qh12.onrender.com/subscriptions/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setSubscriptions(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        My Subscriptions
      </h1>

      {subscriptions.length === 0 ? (
        <p>No Active Subscription</p>
      ) : (
        subscriptions.map((sub: any) => (
          <div
            key={sub.id}
            className="bg-white p-4 rounded-xl shadow mb-4"
          >
            <h2 className="font-semibold">{sub.plan}</h2>

            <p>Dish: {sub.dish}</p>
            <p>Status: {sub.status}</p>
            <p>Start: {sub.startDate}</p>
            <p>Time: {sub.time}</p>
          </div>
        ))
      )}
    </div>
  );
}