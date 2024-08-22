import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BidDialog from './Biddialog'; // Import the dialog component

export default function ItemInfo() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [shouldRefetch, setShouldRefetch] = useState(false); // State to trigger re-fetch

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/product', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id }),
        })
        .then(response => response.json())
        .then(productData => {
            setData(productData);
            return fetch('http://localhost:3000/imageurl', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: productData.imageSrc }),
            });
        })
        .then(imageUrlResponse => imageUrlResponse.json())
        .then(imageUrlData => {
            setData(prevData => ({
                ...prevData,
                imageUrl: imageUrlData.url,
            }));
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

        // Reset shouldRefetch to false after fetching data
        setShouldRefetch(false);

    }, [id, shouldRefetch]); // Add shouldRefetch to the dependency array

    const handleDialogClose = () => {
        setDialogOpen(false);
        setShouldRefetch(true); // Trigger re-fetch when dialog closes
    };

    return (
        <div className="bg-white">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-3 sm:px-6 sm:py-6 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{data.name}</h2>
                        <button
                            onClick={() => setDialogOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Place Bid
                        </button>
                    </div>
                    <p className="mt-4 text-gray-500">{data.details}</p>

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

                <div className="aspect-w-16 aspect-h-9">
                    <img
                        alt={data.imageAlt}
                        src={data.imageUrl}
                        className="object-cover rounded-lg bg-gray-100"
                    />
                </div>
            </div>

            {/* Bid Dialog */}
            {dialogOpen && (
                <BidDialog
                    isOpen={dialogOpen}
                    onClose={handleDialogClose} // Use the new function
                    _id={data._id}
                    name={data.name}
                    endDate={data.endDate}
                    bidPrice={data.bidPrice}
                    bidHistory={data.bidHistory}
                    imageUrl={data.imageUrl}
                />
            )}
        </div>
    );
}
