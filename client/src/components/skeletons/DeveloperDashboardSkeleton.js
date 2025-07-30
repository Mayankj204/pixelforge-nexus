import React from 'react';
import Skeleton from 'react-loading-skeleton';

const StatCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <Skeleton circle height={48} width={48} />
        <Skeleton height={20} width={100} className="mt-4" />
        <Skeleton height={30} width={50} />
    </div>
);

const ProjectCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow flex flex-col justify-between">
        <div className="p-6">
            <Skeleton height={28} width="70%" />
            <Skeleton count={2} className="mt-2" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
            <Skeleton height={30} width={80} />
            <Skeleton height={38} width={100} />
        </div>
    </div>
);


const DeveloperDashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Project Grid Skeleton */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4"><Skeleton width={300} /></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboardSkeleton;