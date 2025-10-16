import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import Notification from "@/Components/Notification/Notification";
import StatCard from "@/Components/Card/StatCard";
import AnalyticsChart from "@/Components/Chart/AnalyticsChart";
import TopLinksCard from "@/Components/Card/TopLinksCard";
import TopProjectsCard from "@/Components/Card/TopProjectsCard";
import DomainStatCard from "@/Components/Card/DomainStatCard";

export default function DashboardPage({
    domainStats,
    topLinks,
    clicksPerMonthShorten,
    topProjects,
    clicksPerMonthProjects,
    clicksByCountry,
}) {
    const { success } = usePage().props;
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (success) {
            setNotification({ type: "success", message: success });
        }
    }, [success]);

    // Data Chart Shorten
    const shortenMonths = clicksPerMonthShorten?.map((c) => c.month) || [];
    const shortenCounts = clicksPerMonthShorten?.map((c) => c.count) || [];

    // Data Chart Projects
    const projectMonths = clicksPerMonthProjects?.map((c) => c.month) || [];
    const projectCounts = clicksPerMonthProjects?.map((c) => c.count) || [];

    const [selectedCountry, setSelectedCountry] = useState("");
    const filteredData = selectedCountry
        ? clicksByCountry.filter(c => c.country === selectedCountry)
        : clicksByCountry;

    const getBaseDomain = (domain) => {
        return (domain?.name ?? window.location.origin).replace(/\/$/, "");
    };
    console.log(domainStats);
    console.log('Dashboard Props:', usePage().props);


    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <div className="py-5">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-100 mb-6">
                    Dashboard
                </h1>

                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                    <StatCard
                        title="Total Earning"
                        value="$25,000"
                        percentage="+3.25%"
                        subtext="$21k today"
                        color="#16a34a"
                        up
                    />

                    <StatCard
                        title="Total Clicks"
                        value="12,540"
                        percentage="+1.8%"
                        subtext="1.2k today"
                        color="#015196"
                        up
                    />

                    <StatCard
                        title="New Users"
                        value="3,256"
                        percentage="-0.6%"
                        subtext="42 left"
                        color="#f59e0b"
                        up={false}
                    />

                    <StatCard
                        title="Subscriptions"
                        value="894"
                        percentage="+4.2%"
                        subtext="8 new today"
                        color="#3BAFDA"
                        up
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-stretch">

                    <div className="col-span-10 h-full">
                        <AnalyticsChart
                            title="Analytics Overview"
                            subtitle="Switch between Shorten URLs, Projects, and Clicks by Country"
                            dataSets={{
                                "Shorten URLs": shortenMonths.map((m, i) => ({ month: m, value: shortenCounts[i] })),
                                "Projects": projectMonths.map((m, i) => ({ month: m, value: projectCounts[i] })),
                                "Clicks by Country": clicksByCountry.map((c) => ({
                                    month: c.country || "Unknown",
                                    value: c.total,
                                })),
                            }}
                        />
                    </div>

                    {/* Top Domains */}
                    <div className="col-span-2 h-full flex flex-col gap-6">
                        <DomainStatCard
                            title="Active Domains"
                            value={domainStats?.active ?? 0}
                            subtext="Verified & Running"
                            color="#015196"
                            icon="mdi:check-decagram"
                            trend="~"
                        />
                        <DomainStatCard
                            title="Pending Verification"
                            value={domainStats?.pending ?? 0}
                            subtext="Awaiting DNS verification"
                            color="#f59e0b"
                            icon="mdi:clock-outline"
                            trend="~"
                        />
                        <DomainStatCard
                            title="Failed Domains"
                            value={domainStats?.failed ?? 0}
                            subtext="Verification Failed"
                            color="#ef4444"
                            icon="mdi:alert-circle-outline"
                            trend="~"
                        />
                    </div>

                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-stretch">

                    {/* Top Links */}
                    <div className="col-span-6 h-full">
                        <TopLinksCard title="Latest Links" links={topLinks} />
                    </div>

                    {/* Top Projects */}
                    <div className="col-span-6 h-full">
                        <TopProjectsCard title="Top 5 Projects" projects={topProjects} className="h-full" />
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
