import { Icon } from "@iconify/react";
import GlassIcons from "@/Components/Card/GlassIcons";
import InfoBadge from "@/Components/Badge/InfoBadge";

const features = [
    {
        icon: "mdi:link-variant",
        title: "Smart Link Shortening",
        desc: "Shorten and customize your links instantly with AI-powered optimization.",
        color: "blue",
    },
    {
        icon: "mdi:chart-line",
        title: "Analytics Dashboard",
        desc: "Track clicks, countries, and devices with real-time insights.",
        color: "purple",
    },
    {
        icon: "mdi:account-group",
        title: "Team Collaboration",
        desc: "Manage branded links across your team with shared analytics access.",
        color: "red",
    },
    {
        icon: "mdi:clock-outline",
        title: "Real-time Updates",
        desc: "All link performance updates in real time without page reloads.",
        color: "indigo",
    },
    {
        icon: "mdi:lock-outline",
        title: "Security First",
        desc: "Every shortened link is encrypted and privacy-protected.",
        color: "orange",
    },
    {
        icon: "mdi:cog-outline",
        title: "Custom Domains",
        desc: "Use your own branded domains to strengthen trust and identity.",
        color: "green",
    },
];

export default function FeaturesSection() {
    const items = features.map((f) => ({
        icon: <Icon icon={f.icon} className="text-2xl text-white" />,
        label: f.title,
        desc: f.desc,
        color: f.color,
    }));

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <div className="pb-6">
                    {/* Heading */}
                    <InfoBadge
                        label="✨ Our Features"
                        color="#16a34a"
                        bgColor="rgba(22,163,74,0.1)"
                        borderColor="rgba(22,163,74,0.3)"
                    />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                    Powerful tools to make your links work smarter
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                    Streamline your workflow and gain insight into your audience with our all-in-one shortening and analytics tools.
                </p>

                {/* Features Grid (GlassIcons) */}
                <div className="mt-8">
                    <GlassIcons items={items} className="justify-center" />
                </div>
            </div>
        </section>
    );
}
