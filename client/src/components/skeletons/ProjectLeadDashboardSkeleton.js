import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ProjectLeadDashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton height={36} width={400} />
                <Skeleton height={24} width={500} className="mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow"><Skeleton circle height={48} width={48} /><Skeleton height={20} width={100} className="mt-4" /><Skeleton height={30} width={50} /></div>
                <div className="bg-white p-6 rounded-lg shadow"><Skeleton circle height={48} width={48} /><Skeleton height={20} width={100} className="mt-4" /><Skeleton height={30} width={50} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
                    <Skeleton height={28} width={200} />
                    <Skeleton height={40} className="mt-4" />
                    <Skeleton height={40} className="mt-2" />
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                    <Skeleton height={32} width={300} />
                    <Skeleton height={300} className="mt-4" />
                </div>
            </div>
        </div>
    );
};

export default ProjectLeadDashboardSkeleton;