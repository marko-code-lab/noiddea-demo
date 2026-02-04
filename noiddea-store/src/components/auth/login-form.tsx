'use client';

import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { Button } from "../ui/button";
import { Spinner } from "@/components/ui/spinner";
import { loginUser } from "@/services/auth-actions";
import { loginUserClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Tabs, TabsContent } from "../ui/tabs";
import { getDatabaseClient } from "@/lib/db/client";
import { query } from "@/lib/database";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/types";
import { LoadingOverlay } from "../loading-overlay";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("set-user");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users with auth accounts - ONLY OWNERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        if (typeof window !== 'undefined' && isNative()) {
          // In native mode, use direct database query - ONLY FETCH OWNERS
          const authUsers = await query<{ user_id: string; email: string; user_name: string }>(
            `SELECT 
              au.user_id as user_id,
              au.email as email,
              u.name as user_name
             FROM auth_users au
             INNER JOIN users u ON u.id = au.user_id
             INNER JOIN branches_users bu ON bu.user_id = au.user_id AND bu.role = 'cashier' AND bu.is_active = 1
             ORDER BY u.name ASC`,
            []
          );

          const mappedUsers = authUsers.map((row) => ({
            id: row.user_id,
            email: row.email,
            name: row.user_name,
            phone: "",
            avatar_url: "",
            created_at: "",
            user_metadata: {
              name: row.user_name,
              phone: "",
            },
          }));
          setUsers(mappedUsers);
        } else {
          // In server mode, use database client - ONLY FETCH OWNERS
          const db = getDatabaseClient();
          const authUsers = await db.select<{ user_id: string; email: string; user_name: string }>(
            `SELECT 
              au.user_id as user_id,
              au.email as email,
              u.name as user_name
             FROM auth_users au
             INNER JOIN users u ON u.id = au.user_id
             INNER JOIN businesses_users bu ON bu.user_id = au.user_id AND bu.role = 'owner' AND bu.is_active = 1
             ORDER BY u.name ASC`
          );

          const mappedUsers = authUsers.map((row) => ({
            id: row.user_id,
            email: row.email,
            name: row.user_name,
            phone: "",
            avatar_url: "",
            created_at: "",
            user_metadata: {
              name: row.user_name,
              phone: "",
            },
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Set the first user as selected when users are loaded
  useEffect(() => {
    if (users.length > 0 && selectedUserId === undefined) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get email from selected user if in set-user tab
    if (activeTab === "set-user") {
      if (!selectedUserId) {
        toast.error("Por favor, seleccione un usuario");
        return;
      }
      const selectedUser = users.find((u) => u.id === selectedUserId);
      if (selectedUser) {
        setEmail(selectedUser.email);
        setActiveTab("set-password");
        return;
      }
    }

    if (!email || !password) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      // En modo Electron, usar la versión cliente que usa IPC
      // En modo servidor, usar la Server Action
      let result;
      if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        result = await loginUserClient({ email, password });
      } else {
        result = await loginUser({ email, password });
      }

      if (!result.success || 'error' in result) {
        toast.error(('error' in result ? result.error : undefined) || "Error al iniciar sesión");
        setIsLoading(false);
        return;
      }

      if (!result.userId) {
        toast.error("No se pudo autenticar el usuario.");
        setIsLoading(false);
        return;
      }

      // Debug: verificar qué contiene result
      console.log('[LoginForm] Result del login:', result);
      console.log('[LoginForm] isCashier:', 'isCashier' in result ? result.isCashier : 'no presente');
      console.log('[LoginForm] role:', result.role);
      console.log('[LoginForm] isOwner:', 'isOwner' in result ? result.isOwner : 'no presente');

      // Redirigir según el rol - SOLO PERMITIR CASHIERS
      if (('isCashier' in result && result.isCashier) || result.role === 'cashier') {
        // Cashier → redirigir a /session
        toast.success(`¡Bienvenido! Accediendo a la caja`);
        setIsLoading(false);
        // Esperar un momento para que las cookies/localStorage se guarden
        await new Promise(resolve => setTimeout(resolve, 300));

        // Trigger session update event for SessionProvider
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('kapok-session-update'));
        }

        // En Electron, usar window.location para forzar recarga completa y que useUser detecte el token
        // Redirigir a la página de sesión después del login
        if (typeof window !== 'undefined') {
          window.location.href = "/session";
        }
      } else {
        console.log('[LoginForm] Usuario no es cashier - acceso denegado');
        // Usuario sin permisos de cashier - DENEGAR ACCESO
        toast.error("Esta aplicación es solo para propietarios. Contacta al administrador.");
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Ocurrió un error. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FieldSet className="mx-auto w-sm">
      {loadingUsers && (
        <LoadingOverlay isLoading={true} />
      )}
      <FieldLegend className="text-center text-2xl!">Bienvenido nuevamente</FieldLegend>
      <FieldDescription className="text-center">
        {activeTab === "set-user" ? "Seleccione un usuario para acceder a su espacio" : "Ingrese su contraseña para acceder a su espacio"}
      </FieldDescription>
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="set-user">
            <FieldGroup >
              <RadioGroup value={selectedUserId} onValueChange={setSelectedUserId}>
                {users.map((user) => (
                  <Item key={user.id} variant="outline">
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-0">
                      <ItemTitle >{user.name}</ItemTitle>
                      <ItemDescription >{user.email}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <RadioGroupItem value={user.id} />
                    </ItemActions>
                  </Item>
                ))}
                {users.length === 0 && !loadingUsers && (
                  <div >
                    No hay usuarios disponibles
                  </div>
                )}
              </RadioGroup>
              <Field>
                <Button
                  type="button"
                  onClick={() => {
                    if (!selectedUserId) {
                      toast.error("Por favor, seleccione un usuario");
                      return;
                    }
                    const selectedUser = users.find((u) => u.id === selectedUserId);
                    if (selectedUser) {
                      setEmail(selectedUser.email);
                      setActiveTab("set-password");
                    }
                  }}
                  disabled={loadingUsers || !selectedUserId}
                >
                  Continuar
                </Button>
              </Field>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="set-password">
            <FieldGroup>
              <div className="flex justify-center">
                <InputOTP className="" maxLength={8} value={password} onChange={(value) => setPassword(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner /> : "Ingresar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("set-user")}>
                  Regresar
                </Button>
              </Field>
            </FieldGroup>
          </TabsContent>
        </Tabs>
      </form>
    </FieldSet >
  );
}
