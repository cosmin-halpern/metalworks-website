import React from 'react';
import { Ruler, Wrench, Hammer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ServiceIconProps = {
    iconKey?: string;
    className?: string;
};

const iconMap: Record<string, LucideIcon> = {
    proiectare: Ruler,   // design
    executie: Hammer,    // execution / fabrication
    montaj: Wrench,      // installation / assembly
    default: Hammer
};

const ServiceIcon: React.FC<ServiceIconProps> = ({ iconKey, className }) => {
    const IconComponent = iconKey ? iconMap[iconKey] ?? iconMap.default : iconMap.default;

    return (
        <div className="inline-flex items-center justify-center text-blue-600">
            <IconComponent className={className ?? 'h-10 w-10'} />
        </div>
    );
};

export default ServiceIcon;