import { getPublicCourse } from "@/app/actions/courses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CourseDetailClient from "./CourseDetailClient";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getPublicCourse(id);

    if (!res.success || !res.course) {
        return (
            <div className="text-center py-40 px-6 max-w-lg mx-auto min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-4xl font-black text-slate-900 mb-4">Course Unavailable</h1>
                <p className="text-slate-500 mb-10 text-lg">The course you are looking for might have been moved, unpublished, or doesn't exist.</p>
                <Link href="/courses">
                    <Button className="rounded-2xl h-16 px-12 font-black text-lg">Browse Latest Courses</Button>
                </Link>
            </div>
        );
    }

    return <CourseDetailClient course={res.course} lessons={res.lessons || []} />;
}

