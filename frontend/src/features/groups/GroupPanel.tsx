import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiFetch } from '../../services/api';
import type {
  GroupBalance,
  GroupDetail,
  GroupSummary,
} from '../../types/group';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
});

const addMemberSchema = z.object({
  memberEmail: z.string().email('Enter a valid email'),
});

type CreateGroupValues = z.infer<typeof createGroupSchema>;
type AddMemberValues = z.infer<typeof addMemberSchema>;

type Props = {
  currentUserId: string;
};

export function GroupPanel({ currentUserId }: Props) {
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const { data: groups } = useQuery({
    queryKey: ['groups', currentUserId],
    queryFn: () => apiFetch<GroupSummary[]>('/groups'),
  });
  const { data: groupDetail } = useQuery({
    queryKey: ['group-detail', currentUserId, selectedGroupId],
    queryFn: () => apiFetch<GroupDetail>(`/groups/${selectedGroupId}`),
    enabled: Boolean(selectedGroupId),
  });
  const { data: groupBalance } = useQuery({
    queryKey: ['group-balance', currentUserId, selectedGroupId],
    queryFn: () => apiFetch<GroupBalance>(`/groups/${selectedGroupId}/balance`),
    enabled: Boolean(selectedGroupId),
  });

  useEffect(() => {
    if (!groups?.length) {
      setSelectedGroupId('');
      return;
    }
    if (!selectedGroupId || !groups.some((group) => group.id === selectedGroupId)) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const createGroupForm = useForm<CreateGroupValues>({
    resolver: zodResolver(createGroupSchema),
  });
  const addMemberForm = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
  });

  const createGroupMutation = useMutation({
    mutationFn: (values: CreateGroupValues) =>
      apiFetch<GroupDetail>('/groups', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: (group) => {
      void queryClient.invalidateQueries({ queryKey: ['groups', currentUserId] });
      setSelectedGroupId(group.id);
      createGroupForm.reset();
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (values: AddMemberValues) =>
      apiFetch<GroupDetail>(`/groups/${selectedGroupId}/members`, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['group-detail', currentUserId, selectedGroupId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['group-balance', currentUserId, selectedGroupId],
      });
      void queryClient.invalidateQueries({ queryKey: ['groups', currentUserId] });
      addMemberForm.reset();
    },
  });

  return (
    <section className="panel">
      <h2>Groups</h2>
      <p className="hint">Create a group for occasional shared expenses.</p>

      <form
        onSubmit={createGroupForm.handleSubmit((values) =>
          createGroupMutation.mutate(values),
        )}
        className="form compact-form"
      >
        <label>
          Group name
          <input type="text" {...createGroupForm.register('name')} />
        </label>
        {createGroupForm.formState.errors.name && (
          <p className="error">{createGroupForm.formState.errors.name.message}</p>
        )}
        {createGroupMutation.isError && (
          <p className="error">{createGroupMutation.error.message}</p>
        )}
        <button type="submit" disabled={createGroupMutation.isPending}>
          {createGroupMutation.isPending ? 'Creating…' : 'Create Group'}
        </button>
      </form>

      {groups && groups.length > 0 ? (
        <>
          <label className="group-select">
            Active group
            <select
              value={selectedGroupId}
              onChange={(event) => setSelectedGroupId(event.target.value)}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.memberCount})
                </option>
              ))}
            </select>
          </label>

          {groupDetail && (
            <div className="group-layout">
              <div>
                <h3>{groupDetail.name}</h3>
                <p className="hint">
                  {groupDetail.members.length} member
                  {groupDetail.members.length === 1 ? '' : 's'}
                </p>
                <ul className="member-list">
                  {groupDetail.members.map((member) => (
                    <li key={member.id}>{member.email}</li>
                  ))}
                </ul>

                <form
                  onSubmit={addMemberForm.handleSubmit((values) =>
                    addMemberMutation.mutate(values),
                  )}
                  className="form compact-form"
                >
                  <label>
                    Add member by email
                    <input type="email" {...addMemberForm.register('memberEmail')} />
                  </label>
                  {addMemberForm.formState.errors.memberEmail && (
                    <p className="error">
                      {addMemberForm.formState.errors.memberEmail.message}
                    </p>
                  )}
                  {addMemberMutation.isError && (
                    <p className="error">{addMemberMutation.error.message}</p>
                  )}
                  <button type="submit" disabled={addMemberMutation.isPending}>
                    {addMemberMutation.isPending ? 'Adding…' : 'Add Member'}
                  </button>
                </form>
              </div>

              {groupBalance && (
                <div>
                  <h3>Balance</h3>
                  <div className="balance-grid">
                    {groupBalance.members.map((member) => (
                      <article key={member.id} className="balance-card">
                        <span>{member.email}</span>
                        <strong>Net ${member.net.toFixed(2)}</strong>
                        <small>
                          Paid ${member.paid.toFixed(2)} · Share ${member.share.toFixed(2)}
                        </small>
                      </article>
                    ))}
                  </div>
                  <div className="settlements">
                    <h4>Settlements</h4>
                    {groupBalance.settlements.length === 0 ? (
                      <p className="hint">No settlements needed.</p>
                    ) : (
                      <ul className="member-list">
                        {groupBalance.settlements.map((settlement, index) => {
                          const from = groupBalance.members.find(
                            (member) => member.id === settlement.fromUserId,
                          );
                          const to = groupBalance.members.find(
                            (member) => member.id === settlement.toUserId,
                          );
                          return (
                            <li key={`${settlement.fromUserId}-${settlement.toUserId}-${index}`}>
                              {from?.email ?? settlement.fromUserId} pays {to?.email ?? settlement.toUserId}{' '}
                              ${settlement.amount.toFixed(2)}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="hint">No groups yet.</p>
      )}
    </section>
  );
}
