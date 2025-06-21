import BuyNow from "./BuyNow";
import {
  Banknote,
  Users,
  LayoutGrid,
  BarChart2,
  Paintbrush2,
  Headset,
  Puzzle,
  Database,
} from "lucide-react";

const featureIcons = {
  "24/7 Support": <Headset className="w-4 h-4 text-blue-400 inline-block" />,
  "Custom Integration": <Puzzle className="w-4 h-4 text-purple-400 inline-block" />,
  "Unlimited Users": <Users className="w-4 h-4 text-blue-500 inline-block" />,
  "All 7 Management Portals": <LayoutGrid className="w-4 h-4 text-indigo-400 inline-block" />,
  "Advanced Analytics": <BarChart2 className="w-4 h-4 text-pink-400 inline-block" />,
  "Data Backup": <Database className="w-4 h-4 text-green-400 inline-block" />,
  "Custom Branding": <Paintbrush2 className="w-4 h-4 text-yellow-400 inline-block" />,
};



const PricingCard = ({index,plan}) => {
  return (
     <section
            key={index}
            className={`relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100/60 transition-transform duration-300 hover:scale-105 ${
              plan.mostPopular
                ? "ring-2 ring-blue-500/40 ring-offset-2 shadow-blue-100"
                : ""
        }`}
          >
            {/* Badge for NEW or HOT */}
            {plan.badge && (
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                plan.badge === "NEW"
                  ? "bg-gradient-to-r from-blue-500 to-purple-400 text-white"
                  : "bg-gradient-to-r from-yellow-500 to-pink-500 text-white"
              }`}>
                {plan.badge}
              </span>
            )}
            {/* Most Popular badge */}
            {plan.mostPopular && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Most Popular
              </span>
            )}
            <div className="mb-4">{plan.icon}</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{plan.title}</h2>
            <p className="text-xl font-semibold mb-4 flex items-center gap-2">
              {plan.discountedPrice ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    ${plan.originalPrice / 100}
                  </span>
                  <span className="text-blue-700 font-bold">
                    ${plan.discountedPrice / 100}
                  </span>
                </>
              ) : (
                <span className="text-blue-700 font-bold">${plan.price / 100}</span>
              )}
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-700 text-left w-full">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="mb-1 flex items-center gap-2">
                  {featureIcons[feature] || <Banknote className="w-4 h-4 text-blue-400 inline-block" />} {feature}
                </li>
              ))}
            </ul>
            {/* Buy Now Button */}
         <BuyNow />
          </section>
  )
}

export default PricingCard