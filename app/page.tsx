"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

type Hotel = {
  _id: string;
  name: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  desc: string;
  rating: number;
};

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) return router.push("/auth/login");
    const fetchHotels = async () => {
      try {
        const response = await axios.get("/hotels/getAllHotels", {
          headers: {
            Authorization: localStorage.getItem("token"),
            "x-api-key": "ThisIsAPIKey",
          },
        });
        setHotels(response.data.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-8">Hotel Selection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={hotel.photos[0] || "/placeholder.jpg"}
              onError={(e) => {
                // @ts-ignore
                e.target.src = "/placeholder.png";
              }}
              alt={hotel.name}
              className="w-full h-48 object-contain rounded-md mb-4"
            />
            <h2 className="text-xl font-bold">{hotel.name}</h2>
            <p className="text-sm text-gray-600">{hotel.city}</p>
            <p className="text-sm text-gray-600">{hotel.distance}</p>
            <p className="text-gray-700 mt-2">{hotel.desc}</p>
            <Button
              variant="default"
              className="mt-4 w-full"
              onClick={() => router.push(`/hotels/${hotel._id}`)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
