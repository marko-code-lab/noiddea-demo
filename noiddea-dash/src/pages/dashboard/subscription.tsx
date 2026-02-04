import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CreditCard, Mobile } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SubscriptionPage() {
  return <div className="p-6 flex items-center justify-center h-dvh">
    <FieldSet className="w-md">
      <FieldLegend>Mi suscripción</FieldLegend>
      <FieldDescription>Estas usando una versión de prueba, esta aplicación es totalmente gratuita, y puedes obtenerlo en <a href="https://noiddea.vercel.app" target="_blank" rel="noopener noreferrer">https://noiddea.vercel.app</a>.
        Para brindar apoyo al desarrollador, puedes utilizar los siguientes medios de pago.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel>Transferencia Interbank</FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <HugeiconsIcon icon={CreditCard}/>
            </InputGroupAddon>
            <InputGroupInput type="text" value="8983497341932" readOnly />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel>Transferencia Interbancaria</FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <HugeiconsIcon icon={Mobile}/>
            </InputGroupAddon>
            <InputGroupInput type="text" value="00389801349734193245" readOnly />
          </InputGroup>
        </Field>
        <Field>
          <FieldDescription>
            Con Noiddea Online, puedes maneja tus ventas desde cualquier parte del mundo, observa tus ventas en tiempo real, obten reportes automaticos y mucho más.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>;
}
