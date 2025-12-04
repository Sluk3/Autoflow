
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassModal from '../components/shared/GlassModal';
import CustomerForm from '../components/customers/CustomerForm';

const ITEMS_PER_PAGE = 50;

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/5917132c-5c5a-4d35-b493-6062989ee46a', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/f7a0c555-e94b-419a-a699-a05120727949', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setIsModalOpen(false);
      setSelectedCustomer(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/6a891e44-1c12-4ffb-aefc-1dcedc13fcd0', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify({ customer_id: id, ...data }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setIsModalOpen(false);
      setSelectedCustomer(null);
    },
  });

  const filteredCustomers = customers.filter(customer =>
    `${customer.first_name} ${customer.last_name} ${customer.phone} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (data) => {
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.customer_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer({
      ...customer,
      id: customer.customer_id
    });
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <p className="text-slate-400 text-sm">
        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-slate-400 text-sm flex items-center px-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Customers</h1>
          <p className="text-slate-400">{customers.length} total customers</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {totalPages > 1 && <div className="mb-4"><PaginationControls /></div>}

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {paginatedCustomers.map((customer) => (
              <div
                key={customer.customer_id}
                className="glass-morphism-card rounded-xl p-6 glass-hover"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {customer.first_name} {customer.last_name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {customer.total_vehicles} Vehicles
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {customer.total_jobs} Jobs
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            €{parseFloat(customer.total_spent_eur || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-4 h-4" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.city && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-4 h-4" />
                          <span>{customer.address ? `${customer.address}, ` : ''}{customer.city} {customer.postal_code}</span>
                        </div>
                      )}
                      {customer.last_visit_date && (
                        <p className="text-slate-400 text-sm mt-2">
                          Last visit: {new Date(customer.last_visit_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {customer.notes && (
                      <p className="mt-3 text-slate-300 text-sm bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                        {customer.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(customer)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && <div className="mt-4 pt-4 border-t border-slate-700"><PaginationControls /></div>}
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        title={selectedCustomer ? 'Edit Customer' : 'New Customer'}
      >
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </GlassModal>
    </div>
  );
}
