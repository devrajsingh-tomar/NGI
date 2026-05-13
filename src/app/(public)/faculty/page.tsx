import { getDynamicPageData } from "@/app/actions/cms";
import { getFaculty } from "@/app/actions/faculty";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import FacultySection from "@/components/public/FacultySection";
import DirectorMessageSection from "@/components/public/DirectorMessageSection";
import { getCMSContent } from "@/services/CMSService";

export default async function PublicFacultyPage() {
    const [dynamicData, facultyRes, directorInfo] = await Promise.all([
        getDynamicPageData("faculty"),
        getFaculty(),
        getCMSContent("DIRECTOR_INFO")
    ]);

    const facultyMembers = facultyRes.success ? facultyRes.faculty : [];
    
    // Use the dedicated CMS info for director/chairman, or fallback to first faculty ONLY if absolutely necessary
    const director = directorInfo || facultyMembers[0];

    const staticFallbackContent = facultyMembers.length > 0 ? (
        <div className="min-h-screen bg-white pt-40 pb-24">
            <div className="container mx-auto">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-20 text-center tracking-tighter">
                    Leadership & <span className="text-primary italic font-serif">Faculty</span>
                </h1>

                {/* Director's Message Section Component */}
                {director && (
                    <DirectorMessageSection 
                        director={director} 
                        data={{ bg_color: "bg-primary rounded-[4rem] mb-32 shadow-xl shadow-primary/20" }} 
                    />
                )}

                {/* Full Faculty List */}
                <div className="pt-20">
                    <FacultySection members={facultyMembers} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium italic">
            No faculty members listed yet...
        </div>
    );

    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer 
                sections={cmsSections} 
                extraData={{ 
                    faculty: facultyMembers,
                    director: directorInfo
                }}
                staticFallback={staticFallbackContent} 
            />
        </div>
    );
}
