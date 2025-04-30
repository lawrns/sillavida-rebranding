import React from 'react';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  testimonial?: { quote: string; author: string };
}

interface VidaBenefitsProps {
  benefits: Benefit[];
}

const VidaBenefits: React.FC<VidaBenefitsProps> = ({ benefits }) => {
  return (
    <div className="vida-benefits">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map(benefit => (
          <div key={benefit.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-teal rounded-full p-2">
                <img src={benefit.icon} alt="icon" className="w-5 h-5 object-contain" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-teal">{benefit.title}</h3>
            </div>
            <p className="font-body text-gray-700 mb-4 leading-relaxed">{benefit.description}</p>
            {benefit.testimonial && (
              <blockquote className="italic text-sm text-gray-600 mt-4 border-l-4 border-teal pl-4 py-2 bg-gray-50 rounded-r-md">
                <p className="mb-2">"{benefit.testimonial.quote}"</p>
                <footer className="font-medium text-teal-700 text-right">
                  — {benefit.testimonial.author}
                </footer>
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VidaBenefits;
