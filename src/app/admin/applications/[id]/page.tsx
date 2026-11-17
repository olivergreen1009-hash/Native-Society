import { AdminApplicationDetail } from "@/components/admin/admin-application-detail";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminApplicationDetail id={id} />;
}