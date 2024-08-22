import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const features = [
  { name: 'Origin', description: 'Designed by Good Goods, Inc.' },
  { name: 'Material', description: 'Solid walnut base with rare earth magnets and powder coated steel card cover' },
  { name: 'Dimensions', description: '6.25" x 3.55" x 1.15"' },
  { name: 'Finish', description: 'Hand sanded and finished with natural oil' },
  { name: 'Includes', description: 'Wood card tray and 3 refill packs' },
  { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
];

export default function Iteminfo() {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
    
            // Perform the Axios POST request with the Authorization header
            const response = await axios.post(
              'http://localhost:3000/product',
              {
                _id: "66c5dd385af8085d11a551ef"
              }, // You can pass any data here as the request body if needed
              {
                headers: {
                  'Authorization': `Bearer ${token}`, // Add token here
                  'Content-Type': 'application/json', // Ensure JSON content type
                },
              }
            );
    
            setData(response.data);
            console.log(data.imageSrc);

            const imageUrlResponse = await axios.post(
                'http://localhost:3000/imageurl',
                { image: data.imageSrc },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

            console.log(imageUrlResponse);

          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
    
        fetchProducts();
      }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-3 sm:px-6 sm:py-6 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{data.name}</h2>
          <p className="mt-4 text-gray-500">
            {data.details}
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Bid Price</dt>
                <dd className="mt-2 text-sm text-gray-500">{data.bidPrice}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">End Date</dt>
                <dd className="mt-2 text-sm text-gray-500">{data.endDate}</dd>
            </div>
          </dl>
          <div className="border-t border-gray-200 pt-4 mt-10">
                <dt className="font-medium text-gray-900">Bid History</dt>
                <div className="mt-2 space-y-4">
                    {Array.isArray(data.bidHistory) && data.bidHistory.slice().reverse().map((bid) => (
                        <div key={bid._id} className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">{bid.username}</dt>
                            <dd className="mt-2 text-sm text-gray-500">{bid.bidPrice}</dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Image with aspect ratio */}
        <div className="aspect-w-16 aspect-h-9">
          <img
            alt="Sample image showing a walnut card tray."
            src=""
            className="object-cover rounded-lg bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
