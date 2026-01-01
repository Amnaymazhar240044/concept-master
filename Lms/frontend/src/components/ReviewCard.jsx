import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                        <Star
                            key={index}
                            size={16}
                            className={`${index < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
                "{review.comment}"
            </p>

            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                    {review.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">{review.name}</span>
            </div>
        </div>
    );
};

export default ReviewCard;
