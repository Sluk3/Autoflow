
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Clock, CheckCircle, AlertCircle, XCircle, CreditCard, ArrowRight, Ban, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassModal from '../components/shared/GlassModal';
import WorkOrderForm from '../components/workorders/WorkOrderForm';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 50;

const statusConfig = {
  SCHEDULED: { 
    icon: Clock, 
    color: 'text-blue-300', 
    bg: 'bg-blue-500/20', 
    border: 'border-blue-400/30',
    label: 'Scheduled'
  },
  IN_REPAIR: { 
    icon: AlertCircle, 
    color: 'text-amber-300', 
    bg: 'bg-amber-500/20', 
    border: 'border-amber-400/30',
    label: 'In Repair'
  },
  COMPLETED: { 
    icon: CheckCircle, 
    color: 'text-emerald-300', 
    bg: 'bg-emerald-500/20', 
    border: 'border-emerald-400/30',
    label: 'Completed'
  },
  CANCELLED: { 
    icon: XCircle, 
    color: 'text-red-300', 
    bg: 'bg-red-500/20', 
    border: 'border-red-400/30',
    label: 'Cancelled'
  },
};

const paymentStatusConfig = {
  paid: { color: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', label: 'Paid' },
  pending: { color: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-400/30', label: 'Pending' },
  cancelled: { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-400/30', label: 'Cancelled' },
};

export default function WorkOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('SCHEDULED');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStartRepairModalOpen, setIsStartRepairModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToStartRepair, setOrderToStartRepair] = useState(null);
  const [orderToComplete, setOrderToComplete] = useState(null);
  const [orderToDeactivate, setOrderToDeactivate] = useState(null);
  const queryClient = useQueryClient();

  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/bf0b516d-cc4c-43c5-8bf6-bc622cf30674', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/e7b36266-8089-4337-932a-831a3318f559', {
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
      queryClient.invalidateQueries(['workOrders']);
      setIsModalOpen(false);
      setSelectedWorkOrder(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/1119f46b-3686-4985-82f1-4da16dee66de', {
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
      queryClient.invalidateQueries(['workOrders']);
      setIsModalOpen(false);
      setSelectedWorkOrder(null);
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ work_id, status }) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/6dd147c3-0f6f-4d13-85b9-4d66dc0f3162', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify({ work_id, status }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workOrders']);
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
      setIsStartRepairModalOpen(false);
      setOrderToStartRepair(null);
      setIsCompleteModalOpen(false);
      setOrderToComplete(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async ({ work_id }) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/f17c3310-f772-44d0-a93f-7bd0a85b8869', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify({ work_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workOrders']);
      setIsDeactivateModalOpen(false);
      setOrderToDeactivate(null);
    },
  });

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = `${order.work_type} ${order.customer_name} ${order.license_plate || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    let matchesStatus = false;
    if (statusFilter === 'HISTORY') {
      matchesStatus = true;
    } else if (statusFilter === 'SCHEDULED') {
      matchesStatus = order.status === 'SCHEDULED';
    } else if (statusFilter === 'ACTIVE') {
      matchesStatus = order.status === 'IN_REPAIR';
    } else if (statusFilter === 'READY') {
      // Ready tab only shows COMPLETED orders that are still active
      matchesStatus = order.status === 'COMPLETED' && order.is_active !== false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredWorkOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWorkOrders = filteredWorkOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const statusCounts = {
    HISTORY: workOrders.length,
    SCHEDULED: workOrders.filter(w => w.status === 'SCHEDULED').length,
    ACTIVE: workOrders.filter(w => w.status === 'IN_REPAIR').length,
    READY: workOrders.filter(w => w.status === 'COMPLETED' && w.is_active !== false).length,
  };

  const handleSubmit = (data) => {
    if (selectedWorkOrder) {
      updateMutation.mutate({ work_id: selectedWorkOrder.work_id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleQuickStatusChange = (order, newStatus) => {
    changeStatusMutation.mutate({ work_id: order.work_id, status: newStatus });
  };

  const handleCancelConfirm = () => {
    if (orderToCancel) {
      changeStatusMutation.mutate({ work_id: orderToCancel.work_id, status: 'CANCELLED' });
    }
  };

  const handleStartRepairConfirm = () => {
    if (orderToStartRepair) {
      changeStatusMutation.mutate({ work_id: orderToStartRepair.work_id, status: 'IN_REPAIR' });
    }
  };

  const handleCompleteConfirm = () => {
    if (orderToComplete) {
      changeStatusMutation.mutate({ work_id: orderToComplete.work_id, status: 'COMPLETED' });
    }
  };

  const handleDeactivateConfirm = () => {
    if (orderToDeactivate) {
      deactivateMutation.mutate({ work_id: orderToDeactivate.work_id });
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <p className="text-slate-300 text-sm">
        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredWorkOrders.length)} of {filteredWorkOrders.length}
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
        <span className="text-white text-sm flex items-center px-3">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Work Orders</h1>
          <p className="text-slate-400">{workOrders.length} total orders</p>
        </div>
        <Button
          onClick={() => {
            setSelectedWorkOrder(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Work Order
        </Button>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        <div className="space-y-6">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="bg-slate-800 border border-slate-700 grid grid-cols-4 w-full">
              <TabsTrigger value="SCHEDULED" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                Scheduled ({statusCounts.SCHEDULED})
              </TabsTrigger>
              <TabsTrigger value="ACTIVE" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                Active ({statusCounts.ACTIVE})
              </TabsTrigger>
              <TabsTrigger value="READY" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                Ready ({statusCounts.READY})
              </TabsTrigger>
              <TabsTrigger value="HISTORY" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                History ({statusCounts.HISTORY})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search work orders..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {totalPages > 1 && <PaginationControls />}

          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : (
            <div className="grid gap-4">
              {paginatedWorkOrders.map((order) => {
                const statusInfo = statusConfig[order.status] || statusConfig.SCHEDULED;
                const StatusIcon = statusInfo.icon;
                const paymentInfo = paymentStatusConfig[order.payment_status] || paymentStatusConfig.pending;
                const displayDate = order.status === 'COMPLETED' && order.completed_date 
                  ? order.completed_date 
                  : order.scheduled_date;
                
                const canCancel = order.status !== 'CANCELLED' && order.status !== 'COMPLETED';
                const showPickupButton = order.status === 'COMPLETED' && order.is_active !== false;
                
                return (
                  <div
                    key={order.work_id}
                    className="glass-morphism-card rounded-xl p-6 glass-hover"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl ${statusInfo.bg} flex items-center justify-center border ${statusInfo.border}`}>
                            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{order.work_type}</h3>
                            <div className="flex gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                                {statusInfo.label}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${paymentInfo.bg} ${paymentInfo.color} border ${paymentInfo.border}`}>
                                <CreditCard className="w-3 h-3" />
                                {paymentInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-white">
                            <span className="font-semibold">{order.customer_name}</span> • {order.license_plate || 'No Plate'}
                          </p>
                          <p className="text-slate-300 text-sm">
                            {order.make} {order.model} {order.year && `(${order.year})`}
                          </p>
                          {order.customer_phone && (
                            <p className="text-slate-300 text-sm">{order.customer_phone}</p>
                          )}
                          <p className="text-slate-300 text-sm">
                            {order.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}: {format(new Date(displayDate), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>

                        {order.work_description && (
                          <p className="text-slate-300 text-sm bg-slate-700/50 rounded-lg p-3 mb-3 border border-slate-600">
                            {order.work_description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          {order.labor_hours && (
                            <span className="text-slate-300">
                              Labor: {order.labor_hours}h @ €{parseFloat(order.labor_rate_eur || 0).toFixed(2)}/h
                            </span>
                          )}
                          {order.parts_cost_eur && parseFloat(order.parts_cost_eur) > 0 && (
                            <span className="text-slate-300">
                              Parts: €{parseFloat(order.parts_cost_eur).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {order.total_price_eur && (
                          <p className="text-2xl font-bold text-white">
                            €{parseFloat(order.total_price_eur).toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {order.status === 'SCHEDULED' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setOrderToStartRepair(order);
                              setIsStartRepairModalOpen(true);
                            }}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Start Repair
                          </Button>
                        )}
                        {order.status === 'IN_REPAIR' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setOrderToComplete(order);
                              setIsCompleteModalOpen(true);
                            }}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                        )}
                        {showPickupButton && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setOrderToDeactivate(order);
                              setIsDeactivateModalOpen(true);
                            }}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Customer Picked Up
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOrderToCancel(order);
                              setIsCancelModalOpen(true);
                            }}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && <div className="pt-4 border-t border-slate-700"><PaginationControls /></div>}
        </div>
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkOrder(null);
        }}
        title={selectedWorkOrder ? 'Edit Work Order' : 'New Work Order'}
        maxWidth="max-w-3xl"
      >
        <WorkOrderForm
          workOrder={selectedWorkOrder}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedWorkOrder(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </GlassModal>

      <GlassModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setOrderToCancel(null);
        }}
        title="Cancel Work Order"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to cancel this work order? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setOrderToCancel(null);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              No, Keep It
            </Button>
            <Button
              onClick={handleCancelConfirm}
              disabled={changeStatusMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Cancel Order
            </Button>
          </div>
        </div>
      </GlassModal>

      <GlassModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setOrderToDeactivate(null);
        }}
        title="Customer Picked Up Vehicle"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Confirm that the customer has picked up their vehicle. This will mark the work order as complete and remove it from the Ready tab.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeactivateModalOpen(false);
                setOrderToDeactivate(null);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivateConfirm}
              disabled={deactivateMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Confirm Pickup
            </Button>
          </div>
        </div>
      </GlassModal>

      {/* Start Repair Confirmation Modal */}
      <GlassModal
        isOpen={isStartRepairModalOpen}
        onClose={() => {
          setIsStartRepairModalOpen(false);
          setOrderToStartRepair(null);
        }}
        title="Start Repair"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to start the repair for this work order? This will change its status to "In Repair".
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsStartRepairModalOpen(false);
                setOrderToStartRepair(null);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartRepairConfirm}
              disabled={changeStatusMutation.isPending}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Yes, Start Repair
            </Button>
          </div>
        </div>
      </GlassModal>

      {/* Complete Confirmation Modal */}
      <GlassModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setOrderToComplete(null);
        }}
        title="Complete Work Order"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to mark this work order as completed? The vehicle will be ready for customer pickup.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCompleteModalOpen(false);
                setOrderToComplete(null);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteConfirm}
              disabled={changeStatusMutation.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Yes, Complete Order
            </Button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
