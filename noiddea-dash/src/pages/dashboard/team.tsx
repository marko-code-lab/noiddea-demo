import { useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, UserGroup02Icon } from "@hugeicons/core-free-icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { CreateUserDialog, UsersTable } from '@/components/dashboard/team';
import { useBusinessUsers, useSelectedBranch } from '@/hooks';
import { LoadingOverlay } from '@/components/loading-overlay';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export function TeamPage() {
  const { selectedBranch } = useSelectedBranch();
  const { users, loading, fetchUsers } = useBusinessUsers(selectedBranch?.id);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className='p-6 h-dvh container mx-auto flex flex-col'>
      <LoadingOverlay isLoading={loading} />
        <header className={cn('flex items-center justify-between mb-4', !users.length && 'hidden')}>
          <InputGroup className='w-96'>
            <InputGroupAddon>
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder='Busqueda...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {users.length} usuarios
            </InputGroupAddon>
          </InputGroup>
          <CreateUserDialog onSuccess={fetchUsers} />
        </header>
        <div className={cn(filteredUsers.length === 0 && !loading && 'flex-1 flex items-center justify-center')}>
          {!loading && filteredUsers.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <HugeiconsIcon icon={UserGroup02Icon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>
                  {searchQuery
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios en el equipo'}
                </EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? 'Intenta ajustar la búsqueda'
                    : 'Agrega usuarios a tu equipo para colaborar'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateUserDialog onSuccess={fetchUsers} />
              </EmptyContent>
            </Empty>
          ) : !loading && (
            <UsersTable users={filteredUsers} onUserUpdated={fetchUsers} />
          )}
      </div>
    </div>
  );
}
