import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Shield, User as UserIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassModal from '../components/shared/GlassModal';
import { useAuth } from '@/context/AuthContext';
import { base44 } from '@/api/n8nClient';
import { hashPassword } from '@/utils/crypto';

export default function UserManagement() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'user' });
  const queryClient = useQueryClient();

  // Check if current user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔍 Fetching users from:', 'https://n8n.srv1041062.hstgr.cloud/webhook/ab4804f8-0aa2-401e-9c53-f7a4097e51be');
      const result = await base44.entities.User.list();
      console.log('📦 Users API response:', result);
      console.log('📊 Is array?', Array.isArray(result));
      console.log('📊 Users count:', result?.length || 0);
      return result;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data) => {
      // Hash password with SHA-256 before sending
      const hashedPassword = await hashPassword(data.password);
      
      return await base44.entities.User.create({
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        role: data.role
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsModalOpen(false);
      setFormData({ email: '', password: '', name: '', role: 'user' });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = {
        email: data.email,
        name: data.name,
        role: data.role
      };

      // Only hash and update password if a new one is provided
      if (data.password) {
        payload.password_hash = await hashPassword(data.password);
      }

      return await base44.entities.User.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsModalOpen(false);
      setSelectedUser(null);
      setFormData({ email: '', password: '', name: '', role: 'user' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      return await base44.entities.User.delete(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, data: formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ 
      email: user.email, 
      password: '', // Don't populate password
      name: user.name, 
      role: user.role 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">{users.length} total users</p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setFormData({ email: '', password: '', name: '', role: 'user' });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading users...</div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error loading users</h3>
            <p className="text-slate-400 mb-4">{error.message}</p>
            <Button onClick={() => queryClient.invalidateQueries(['users'])} className="bg-blue-500 hover:bg-blue-600">
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
            <p className="text-slate-400 mb-4">Create your first user to get started.</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First User
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((userItem) => (
              <div
                key={userItem.id}
                className="glass-morphism-card rounded-xl p-6 glass-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      userItem.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                      {userItem.role === 'admin' ? (
                        <Shield className="w-6 h-6 text-white" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{userItem.name}</h3>
                      <p className="text-slate-300">{userItem.email}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                        userItem.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}>
                        {userItem.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(userItem)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(userItem.id)}
                      disabled={userItem.id === user.id}
                      className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setFormData({ email: '', password: '', name: '', role: 'user' });
        }}
        title={selectedUser ? 'Edit User' : 'New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password {selectedUser && '(leave empty to keep current)'}
            </label>
            <Input
              type="password"
              required={!selectedUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="••••••••"
              minLength={8}
            />
            <p className="text-xs text-slate-400 mt-1">Min 8 characters. Encrypted with SHA-256.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2"
            >
              <option value="user" className="bg-slate-800">User</option>
              <option value="admin" className="bg-slate-800">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
                setFormData({ email: '', password: '', name: '', role: 'user' });
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {selectedUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
