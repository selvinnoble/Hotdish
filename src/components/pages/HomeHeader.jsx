import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { Switch } from "@headlessui/react";

const HomeHeader = () => {
  const [vegOnly, setVegOnly] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#ffb3b3] to-[#ffdede] px-4 pt-5 pb-3 rounded-b-3xl shadow-md">
      {/* Top Row */}
      <div className="flex justify-between items-center text-sm text-black font-medium">
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-red-600 font-bold">Home</span>
            <IoIosArrowDown className="text-red-500" />
          </div>
          <p className="text-xs text-gray-700">Karumanankuzhi, Viricode,...</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-400">
            GOLD ₹1
          </div>
          <div className="bg-blue-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            S
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Restaurant name or a dish"
          className="w-full py-2 pl-10 pr-10 text-sm rounded-full bg-white shadow focus:outline-none"
        />
        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        <FaMicrophone className="absolute right-3 top-3.5 text-red-500" />
      </div>

      {/* VEG MODE Toggle */}
      <div className="flex justify-end items-center text-xs mt-2">
        <span className="mr-2 text-gray-600 font-medium">VEG MODE</span>
        <Switch
          checked={vegOnly}
          onChange={setVegOnly}
          className={`${
            vegOnly ? "bg-green-500" : "bg-gray-300"
          } relative inline-flex h-5 w-10 items-center rounded-full transition`}
        >
          <span
            className={`${
              vegOnly ? "translate-x-5" : "translate-x-1"
            } inline-block w-3 h-3 transform bg-white rounded-full transition`}
          />
        </Switch>
      </div>

      {/* Promo Banner */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow flex justify-between items-center relative">
        <div>
          <p className="text-pink-600 text-lg font-bold">Get <span className="text-black">50% OFF</span></p>
          <p className="text-sm text-gray-500">& FREE delivery on your first order</p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1046/1046849.png"
          alt="offer"
          className="w-14 h-14"
        />
      </div>

      {/* Category Chips */}
      <div className="mt-4 flex space-x-3 overflow-x-auto scrollbar-hide">
        {[
          "Explore",
          "All",
          "Biryani",
          "Chicken",
          "Fried Rice",
          "Pizza"
        ].map((item, idx) => (
          <div
            key={idx}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              item === "All" ? "bg-pink-100 text-pink-600 font-semibold border border-pink-300" : "bg-white text-gray-700 shadow"
            }`}
          >
            {item === "Explore" ? <span className="font-bold text-red-500">FLAT <span className="text-black">50% OFF</span></span> : item}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-3 flex space-x-3 overflow-x-auto text-sm text-gray-600 scrollbar-hide">
        {["Filters", "Under ₹150", "Under 30 mins", "Rating 4.0+"].map((filter, idx) => (
          <div
            key={idx}
            className="bg-white border px-3 py-1 rounded-full whitespace-nowrap shadow-sm"
          >
            {filter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHeader;