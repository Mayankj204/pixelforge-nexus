import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ProjectDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
            <Skeleton height={24} width={150} />
            <div className="mt-4">
                <Skeleton height={36} width={400} />
                <Skeleton height={20} width={500} className="mt-2" />
            </div>
        </div>
        <div className="border-b border-gray-200">
             <Skeleton height={40} width={300} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
            <Skeleton height={30} width={200} />
            <Skeleton count={3} className="mt-4" />
        </div>
    </div>
  );
};

export default ProjectDetailsSkeleton;