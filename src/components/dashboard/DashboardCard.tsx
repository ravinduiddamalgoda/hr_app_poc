import React from 'react';
import Link from 'next/link';
import { DashboardCardProps } from '../../types';

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  icon, 
  color, 
  link 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-200 transform hover:scale-105 border-l-4 border-primary-500">
      <Link href={link}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-1">{count}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DashboardCard;