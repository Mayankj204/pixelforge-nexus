import React from 'react';
import Skeleton from 'react-loading-skeleton';

const StatCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <Skeleton circle height={48} width={48} />
        <Skeleton height={20} width={100} className="mt-4" />
        <Skeleton height={30} width={50} />
    </div>
);

const AdminDashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <Skeleton height={30} width={250} />
                        <Skeleton count={3} className="mt-4" />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <Skeleton height={30} width={250} />
                        <Skeleton height={150} className="mt-4" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <Skeleton height={30} width={200} />
                    <Skeleton height={40} className="mt-4" />
                    <Skeleton height={40} className="mt-2" />
                    <Skeleton height={40} className="mt-2" />
                    <Skeleton height={40} className="mt-4" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSkeleton;