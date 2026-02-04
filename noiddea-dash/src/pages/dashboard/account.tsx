import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks";
import { getNativeAPI } from "@/lib/native";
import { toast } from "sonner";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";

export function AccountPage() {

  const resetDatabase = async () => {
    try {
      const native = await getNativeAPI();
      if (!native) {
        toast.error("No se puede ejecutar en este entorno. Solo funciona en Tauri.");
        return;
      }

      const result = await native.script.resetDatabase();
      toast.success("Base de datos reseteada correctamente");
      const restartToast = toast.loading("La aplicación se reiniciará...");
      console.log(result);
      
      // Reiniciar la aplicación después de resetear
      setTimeout(async () => {
        try {
          await native.app.restart();
        } catch (error) {
          console.error("Error al reiniciar la aplicación:", error);
          toast.dismiss(restartToast);
          // Si falla el reinicio, intentar recargar la página como fallback
          window.location.href = window.location.href;
        }
      }, 1500);
    } catch (error) {
      console.error("Error al resetear la base de datos:", error);
      toast.error(`Error al resetear la base de datos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const { user } = useUser();
  return (
    <div className='p-6 container mx-auto flex items-center justify-center h-dvh'>
      <FieldSet className='w-full max-w-md'>
        <FieldLegend>Datos de la cuenta</FieldLegend>
        <FieldDescription>Conoce tus datos de cuenta.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Nombre
            </FieldLabel>
            <Input
                type='text'
                placeholder='Nombre'
                value={user?.name || user?.user_metadata?.name || 'Usuario'}
                readOnly
            />
          </Field>
          <Field>
            <FieldLabel>Correo electrónico</FieldLabel>
            <Input
                type='email'
                placeholder='Correo electrónico'
                value={user?.email || ''}
                readOnly
            />
          </Field>
          <Field>
            <FieldLabel>Teléfono</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>+51</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type='tel'
                placeholder='000 000 000'
                value={user?.phone || user?.user_metadata?.phone || ''}
                readOnly
              />
            </InputGroup>
          </Field>
          <Field>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                    Eliminar cuenta
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar tu cuenta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La base de datos será eliminada, se perderán todos los datos asociados a este negocio.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => resetDatabase()}>Eliminar cuenta</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <FieldDescription>
              Esta acción no se puede deshacer. La base de datos será eliminada, se perderán todos los datos asociados a este negocio.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}