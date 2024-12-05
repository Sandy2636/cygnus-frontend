"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

type Hotel = {
  name: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  desc: string;
  rating: number;
  rooms: string[];
};

export default function HotelDetails() {
  const router = useRouter();
  const { hotel_id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) return router.push("/auth/login");
    if (hotel_id) {
      const fetchHotelDetails = async () => {
        try {
          const response = await axios.get(`/getAllHotel/${hotel_id}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
              "x-api-key": "ThisIsAPIKey",
            },
          });
          setHotel(response.data.data);
        } catch (error) {
          console.error("Error fetching hotel details:", error);
        }
      };
      fetchHotelDetails();
    }
  }, [hotel_id]);

  if (!hotel) {
    return <p className="text-center mt-10">Loading hotel details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-4">{hotel.name}</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <img
          src={hotel.photos[0] || "/placeholder.png"}
          onError={(e) => {
            // @ts-ignore
            e.target.src = "/placeholder.png";
          }}
          alt={hotel.name}
          className="w-full h-72 object-contain rounded-md mb-4"
        />
        <p className="text-sm text-gray-600">{hotel.address}</p>
        <p className="text-sm text-gray-600">{hotel.distance}</p>
        <p className="text-gray-700 mt-2">{hotel.desc}</p>
        <p className="text-gray-700 mt-2 font-semibold">
          Rating: {hotel.rating} / 5
        </p>
        <h3 className="text-xl font-semibold mt-6">Available Rooms:</h3>
        <ul className="list-disc pl-6 mt-2">
          {hotel.rooms.map((room, index) => (
            <li key={index} className="text-gray-700">
              {room}
            </li>
          ))}
        </ul>
        <Button
          variant="default"
          className="mt-6 w-full"
          onClick={() => router.push("/")}
        >
          Back to Hotels
        </Button>
      </div>
    </div>
  );
}
