import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Payment: React.FC = () => {
  const { houseId } = useParams(); // Get house ID from the URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handlePayment = async () => {
    if (!userDetails.email || !userDetails.phone) {
      alert('Please enter your email and phone number.');
      return;
    }

    setLoading(true);

    try {
      const amountInPaise = 100; // Example amount: ₹50.00 (in paise)

      const options = {
        key: 'rzp_live_I0SwaLrZPMkjwd', // Replace with your Razorpay Key
        amount: amountInPaise,
        currency: 'INR',
        name: 'Rent Payment',
        description: `Payment for House ID: ${houseId}`,
        handler: async (response: any) => {
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Store payment details in Supabase 'rents' table
          const { error } = await supabase.from('rents').insert({
            house_id: houseId,
            amount: amountInPaise / 100, // Convert to rupees
            payment_id: paymentDetails.razorpay_payment_id,
            order_id: paymentDetails.razorpay_order_id,
            status: 'success',
            user_email: userDetails.email, // Store user email
            user_phone: userDetails.phone, // Store user phone number
          });

          if (error) {
            console.error('Error storing payment:', error.message);
            alert('Payment was successful, but failed to update the database. Please contact support.');
          } else {
            alert('Payment Successful!');
            setSuccess(true);
            navigate(`/houses/${houseId}`);
          }
        },
        prefill: {
          name: 'Enter Your Name', // Razorpay requires a name; you can optionally add this field
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Payment error:', error.message);
        alert('Something went wrong: ' + error.message);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Rent Payment</h1>
        <p className="text-gray-600 mb-6">
          Complete the payment process for House ID: <strong>{houseId}</strong>.
        </p>

        {success ? (
          <div className="text-center text-green-600 font-bold">
            Payment was successful! 🎉
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
