import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LayoutDashboard, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function CustomersPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-dvh">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>Funcionalidad no disponible</EmptyTitle>
        <EmptyDescription>Esta funcionalidad aún no está disponible</EmptyDescription>
        <EmptyContent>
          <Button variant="outline" onClick={() => navigate('/dashboard', { replace: true })}>
            <HugeiconsIcon icon={LayoutDashboard} strokeWidth={2} />
            Regresar al dashboard
          </Button>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  </div>
  );
}
