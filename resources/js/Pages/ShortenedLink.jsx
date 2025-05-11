import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

export default function ShortenedLink() {
    return (
            <DashboardLayout >
                <div className="py-5">       
                <h1 className="text-2xl font-bold text-primary-100">Shortened Link</h1>
                <div className="flex justify-between my-3">
                <p className="text-gray-700 text-lg">List Shortened Link</p>
                </div>
                    
                </div>
               
            </DashboardLayout>
    );
}
