import { useState } from "react";
import {
  BadgeDollarSign,
  Star,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PricingCard from "../../components/SmallComponent/PricingCard";
const Data = {
  Pricing: [
    {
      title: "Monthly",
      price: 10000,
      icon: <Calendar className="text-blue-500" />, // Lucide icon
      badge: "NEW", // Add NEW badge
      features: [
        "24/7 Support",
        "Custom Integration",
        "Unlimited Users",
        "All 5 Management Portals",
        "Advanced Analytics",
        "Data Backup",
        "Custom Branding",
      ],
    },
    {
      title: "6 Months",
      originalPrice: 60000,
      discountedPrice: 50000,
      mostPopular: true,
      icon: <Star className="text-purple-500" />, // Lucide icon
      features: [
        "24/7 Support",
        "Custom Integration",
        "All 5 Management Portals",
        "Unlimited Users",
        "Advanced Analytics",
        "Data Backup",
        "Custom Branding",
      ],
    },
    {
      title: "Yearly",
      originalPrice: 120000,
      discountedPrice: 100000,
      icon: <BadgeDollarSign className="text-blue-600" />, // Lucide icon
      badge: "HOT", // Add HOT badge
      features: [
        "24/7 Support",
        "All 5 Management Portals",
        "Custom Integration",
        "Unlimited Users",
        "Advanced Analytics",
        "Data Backup",
        "Custom Branding",
      ],
    },
  ],
  FAQ: [
    {
      question: "What is the difference between monthly and yearly plans?",
      answer:
        "The yearly plan offers a discounted rate compared to the monthly plan, providing better value for long-term users.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time through your account settings.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for all new users to explore our features before committing to a plan.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "For now, We only accept Bank Transfer as a payment method. We are working on integrating more payment options in the future.",
    },
  ],
};

import useTitle from "../../hooks/pageTitle"


const Pricing = () => {
    useTitle("Pricing | Smart Campus");
    
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <main className="min-h-screen bg-white/95 pt-8 pb-16 px-2 sm:px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
        Pricing Plans
        <span className="block w-16 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></span>
      </h1>
      <div className="w-4/5 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 md:grid-cols-3 max-w-6xl mb-16">
        {Data.Pricing.map((plan, index) => (
          <PricingCard plan={plan} index={index} key={index}/>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Frequently Asked Questions
        <span className="block w-16 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></span>
      </h2>
      <div className="w-4/5 lg:w-7/10 mx-auto space-y-4">
        {Data.FAQ.map((faq, index) => (
          <section
            key={index}
            className="p-6 bg-white rounded-xl shadow-md border border-gray-100/60 cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-blue-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              </div>
              {openFaq === index ? (
                <ChevronUp className="text-blue-500 w-5 h-5" />
              ) : (
                <ChevronDown className="text-blue-500 w-5 h-5" />
              )}
            </div>
            {openFaq === index && (
              <p className="mt-4 text-gray-700 border-t border-gray-100 pt-4">{faq.answer}</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};

export default Pricing;
