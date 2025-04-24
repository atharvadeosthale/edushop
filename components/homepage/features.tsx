import React from "react";
import {
  CheckCircle,
  CalendarClock,
  Link as LinkIcon,
  Video,
  CreditCard,
} from "lucide-react";

// Keep the interface definition here as it defines the shape of the expected prop
interface FeatureData {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  bulletPoints: string[];
  visual: {
    icon: React.ElementType;
    gradient: string;
    color: string;
  };
  direction: "left" | "right";
}

interface FeatureItemProps {
  feature: FeatureData;
}

function FeatureItem({ feature }: FeatureItemProps) {
  const {
    icon: Icon,
    title,
    description,
    bulletPoints,
    visual,
    direction,
  } = feature;
  const VisualIcon = visual.icon;
  const textOrder = direction === "right" ? "md:order-1" : "md:order-2";
  const visualOrder = direction === "right" ? "md:order-2" : "md:order-1";

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      {/* Text Content */}
      <div className={`md:w-1/2 order-2 ${textOrder}`}>
        <Icon className="h-10 w-10 text-blue-600 mb-4" />
        <h3 className="text-2xl md:text-3xl font-semibold mb-4">{title}</h3>
        <p className="text-lg text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-2 text-muted-foreground">
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Visual Placeholder */}
      <div
        className={`md:w-1/2 order-1 ${visualOrder} bg-muted/50 p-6 rounded-xl border shadow-sm`}
      >
        <div
          className={`aspect-video bg-gradient-to-br ${visual.gradient} rounded-lg flex items-center justify-center`}
        >
          <VisualIcon className={`h-16 w-16 ${visual.color} opacity-50`} />
        </div>
      </div>
    </div>
  );
}

// Main Features Component - Accept featuresData as a prop
interface FeaturesProps {
  featuresData: FeatureData[];
}

export function Features({ featuresData }: FeaturesProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Render Feature Items dynamically from props */}
      <div className="space-y-16 md:space-y-24">
        {featuresData.map((feature) => (
          <FeatureItem key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
}
