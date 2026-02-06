import { useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { Dealer } from '../types';

const emptyDealer: Omit<Dealer, 'id'> = {
  name: '',
  country: '',
  region: '',
  contactEmail: '',
  contactPhone: '',
  status: 'pending',
  assignedCategories: [],
  createdAt: new Date().toISOString().slice(0, 10),
};

export function DealersPage() {
  const { dealers, categories, addDealer, updateDealer, deleteDealer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [viewingDealer, setViewingDealer] = useState<Dealer | null>(null);
  const [formData, setFormData] = useState(emptyDealer);

  const regions = [...new Set(dealers.map(d => d.region))];

  const filtered = dealers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || d.region === filterRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const openCreateModal = () => {
    setEditingDealer(null);
    setFormData(emptyDealer);
    setIsModalOpen(true);
  };

  const openEditModal = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setFormData(dealer);
    setIsModalOpen(true);
  };

  const openDetail = (dealer: Dealer) => {
    setViewingDealer(dealer);
    setIsDetailOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.country || !formData.contactEmail) return;

    if (editingDealer) {
      updateDealer({ ...editingDealer, ...formData });
    } else {
      addDealer({ ...formData, id: `d${Date.now()}` } as Dealer);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="dealers-page">
      <div className="page-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search dealers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="form-select">
            <option value="all">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <button className="btn btn--primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Dealer
        </button>
      </div>

      <div className="cards-grid">
        {filtered.map(dealer => (
          <div key={dealer.id} className="dealer-card">
            <div className="dealer-card-header">
              <h3 className="dealer-card-name">{dealer.name}</h3>
              <StatusBadge status={dealer.status} />
            </div>
            <div className="dealer-card-body">
              <div className="dealer-info-row">
                <MapPin size={16} />
                <span>{dealer.country} &middot; {dealer.region}</span>
              </div>
              <div className="dealer-info-row">
                <Mail size={16} />
                <span>{dealer.contactEmail}</span>
              </div>
              <div className="dealer-info-row">
                <Phone size={16} />
                <span>{dealer.contactPhone}</span>
              </div>
              <div className="dealer-categories">
                <span className="dealer-categories-label">
                  {dealer.assignedCategories.length} categories assigned
                </span>
              </div>
            </div>
            <div className="dealer-card-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => openDetail(dealer)}>
                <Eye size={14} /> View
              </button>
              <button className="btn btn--secondary btn--sm" onClick={() => openEditModal(dealer)}>
                <Pencil size={14} /> Edit
              </button>
              <button className="btn btn--danger btn--sm" onClick={() => deleteDealer(dealer.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state-card">No dealers found matching your filters.</div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Dealer Details" size="md">
        {viewingDealer && (
          <div className="detail-grid">
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{viewingDealer.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Country</span>
              <span className="detail-value">{viewingDealer.country}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Region</span>
              <span className="detail-value">{viewingDealer.region}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{viewingDealer.contactEmail}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{viewingDealer.contactPhone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value"><StatusBadge status={viewingDealer.status} /></span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">{viewingDealer.createdAt}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Assigned Categories</span>
              <span className="detail-value">
                <div className="tag-list">
                  {viewingDealer.assignedCategories.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return <span key={catId} className="tag">{cat?.name || catId}</span>;
                  })}
                  {viewingDealer.assignedCategories.length === 0 && <span className="text-muted">None</span>}
                </div>
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDealer ? 'Edit Dealer' : 'Add New Dealer'}
        size="md"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                className="form-input"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input
                type="text"
                className="form-input"
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
                placeholder="e.g. Europe, Asia Pacific"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                className="form-input"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as Dealer['status'] })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned Categories</label>
            <div className="checkbox-list">
              {categories.map(cat => (
                <label key={cat.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.assignedCategories.includes(cat.id)}
                    onChange={e => {
                      const updated = e.target.checked
                        ? [...formData.assignedCategories, cat.id]
                        : formData.assignedCategories.filter(id => id !== cat.id);
                      setFormData({ ...formData, assignedCategories: updated });
                    }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>
              {editingDealer ? 'Save Changes' : 'Add Dealer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
