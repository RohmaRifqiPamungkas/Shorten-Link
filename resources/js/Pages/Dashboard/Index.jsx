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

    const clicksByCountryData = clicksByCountry ?? [];


    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-primary-100 sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                        Ringkasan performa, statistik domain, dan insight
                        aktivitas terbaru dalam tampilan yang lebih rapi
                        dan responsif.
                    </p>
                </div>

                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
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

                {/* Analytics + Domain Stats */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch">
                    <div className="min-w-0 xl:col-span-8">
                        <AnalyticsChart
                            title="Analytics Overview"
                            subtitle="Switch between Shorten URLs, Projects, and Clicks by Country"
                            dataSets={{
                                "Shorten URLs": shortenMonths.map((m, i) => ({
                                    month: m,
                                    value: shortenCounts[i],
                                })),
                                Projects: projectMonths.map((m, i) => ({
                                    month: m,
                                    value: projectCounts[i],
                                })),
                                "Clicks by Country": clicksByCountryData.map((c) => ({
                                    month: c.country || "Unknown",
                                    value: c.total,
                                })),
                            }}
                        />
                    </div>

                    <div className="grid min-w-0 gap-6 xl:col-span-4">
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

                {/* Top Lists */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="min-w-0">
                        <TopLinksCard title="Latest Links" links={topLinks} />
                    </div>
                    <div className="min-w-0">
                        <TopProjectsCard
                            title="Top 5 Projects"
                            projects={topProjects}
                            className="h-full"
                        />
                    </div>
                </div>
            </div>

        </DashboardLayout >
    );
}
