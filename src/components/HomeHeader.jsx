import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { Switch } from "@headlessui/react";

const HomeHeader = () => {
  const [vegOnly, setVegOnly] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#FFD3D3] to-[#FFEFEF] p-4 pb-6 rounded-b-3xl shadow">
      {/* Location & Gold Badge Row */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-black font-semibold">
          <div className="flex items-center">
            <span>Karumanankuzhi</span>
            <IoIosArrowDown className="ml-1 text-lg" />
          </div>
          <p className="text-xs text-gray-500">Viricode, Tamil Nadu</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
            GOLD ₹1
          </div>
          <div className="bg-gray-400 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            S
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Search restaurant or dish"
          className="w-full bg-white text-sm py-2 pl-10 pr-10 rounded-full shadow-md outline-none"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <FaMicrophone className="absolute right-3 top-3 text-red-500" />
      </div>

      {/* VEG MODE */}
      <div className="flex justify-end items-center mt-2 text-xs text-gray-600 font-medium">
        VEG MODE
        <Switch
          checked={vegOnly}
          onChange={setVegOnly}
          className={`ml-2 relative inline-flex h-5 w-10 items-center rounded-full transition ${
            vegOnly ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`${
              vegOnly ? "translate-x-5" : "translate-x-1"
            } inline-block w-3 h-3 transform bg-white rounded-full transition`}
          />
        </Switch>
      </div>

      {/* Promo Banner */}
      <div className="mt-4 bg-white rounded-xl p-4 flex justify-between items-center shadow">
        <div>
          <p className="text-red-500 text-lg font-bold">Get 50% OFF</p>
          <p className="text-sm text-gray-500">+ FREE delivery on your first order</p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1046/1046849.png"
          alt="offer"
          className="w-14 h-14 object-contain"
        />
      </div>

      {/* Category Chips */}
      <div className="mt-4 flex space-x-3 overflow-x-auto no-scrollbar">
        {["All", "Biryani", "Chicken", "Fried Rice", "Pizza"].map((item, i) => (
          <div
            key={i}
            className={`px-4 py-1 text-sm rounded-full whitespace-nowrap ${
              i === 0
                ? "bg-pink-100 text-pink-600 font-semibold"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Filter Chips */}
      <div className="mt-3 flex space-x-3 overflow-x-auto no-scrollbar text-sm">
        {["Filters", "Under ₹150", "Under 30 mins", "Rating 4.0+"].map((filter, i) => (
          <div
            key={i}
            className="bg-white text-gray-600 border px-3 py-1 rounded-full whitespace-nowrap shadow-sm"
          >
            {filter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHeader;
