/**
 * Legacy /login route — kept only for backward compatibility.
 * Middleware already redirects this to /student/login.
 * This redirect is a safety net for direct server-side navigation.
 */
import { redirect } from "next/navigation";

export default function LegacyLoginPage() {
    redirect("/student/login");
}
