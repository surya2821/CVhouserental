import React from 'react';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface House {
  title: string;
  image_url: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface HouseCardProps {
  house: House;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  const navigate = useNavigate();

  const handleContact = () => {
    alert('Contact Number: +91 12345 67890');
  };

  const handlePayment = () => {
    // Navigate to a generic payment page
    navigate('/payment');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={house.image_url}
          alt={house.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow">
          <span className="font-semibold text-gray-900">₹{house.price}/mo</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{house.title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1 text-blue-500" />
          <span>{house.location}</span>
        </div>

        <div className="flex justify-between text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed size={16} className="mr-1 text-blue-500" />
            <span>{house.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1 text-blue-500" />
            <span>{house.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1 text-blue-500" />
            <span>{house.area} sqft</span>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between">
          <button
            onClick={handleContact}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Contact
          </button>
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};
