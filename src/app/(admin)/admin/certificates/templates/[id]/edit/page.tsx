
import CertificateEditor from "@/components/admin/CertificateEditor";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CertificateEditor templateId={id} />;
}
