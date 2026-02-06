import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Image,
  Video,
  BookOpen,
  Box,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { ContentItem, ContentType } from '../types';

const typeIcons: Record<ContentType, typeof FileText> = {
  document: FileText,
  image: Image,
  video: Video,
  brochure: BookOpen,
  '3d-model': Box,
};

const emptyContent: Omit<ContentItem, 'id'> = {
  title: '',
  description: '',
  type: 'document',
  category: '',
  tags: [],
  fileName: '',
  fileSize: '',
  uploadedBy: '',
  uploadedAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10),
  visibility: 'all-dealers',
  assignedDealers: [],
  downloadCount: 0,
  language: 'English',
  version: '1.0',
};

export function ContentPage() {
  const { content, categories, dealers, addContent, updateContent, deleteContent, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState(emptyContent);
  const [tagInput, setTagInput] = useState('');

  const filtered = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesVisibility = filterVisibility === 'all' || item.visibility === filterVisibility;
    return matchesSearch && matchesType && matchesCategory && matchesVisibility;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ ...emptyContent, uploadedBy: user.name });
    setTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setFormData(item);
    setTagInput('');
    setIsModalOpen(true);
  };

  const openDetail = (item: ContentItem) => {
    setViewingItem(item);
    setIsDetailOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) return;

    if (editingItem) {
      updateContent({ ...editingItem, ...formData, updatedAt: new Date().toISOString().slice(0, 10) });
    } else {
      addContent({ ...formData, id: `c${Date.now()}` } as ContentItem);
    }
    setIsModalOpen(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className="content-page">
      <div className="page-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select">
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="brochure">Brochures</option>
            <option value="3d-model">3D Models</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="form-select">
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select value={filterVisibility} onChange={e => setFilterVisibility(e.target.value)} className="form-select">
            <option value="all">All Visibility</option>
            <option value="all-dealers">All Dealers</option>
            <option value="selected-dealers">Selected Dealers</option>
            <option value="internal">Internal Only</option>
          </select>
        </div>
        <button className="btn btn--primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Content
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Category</th>
              <th>Visibility</th>
              <th>Size</th>
              <th>Downloads</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const Icon = typeIcons[item.type] || FileText;
              return (
                <tr key={item.id}>
                  <td>
                    <div className="type-icon"><Icon size={18} /></div>
                  </td>
                  <td>
                    <div className="content-cell">
                      <span className="content-title">{item.title}</span>
                      <span className="content-filename">{item.fileName}</span>
                    </div>
                  </td>
                  <td>{getCategoryName(item.category)}</td>
                  <td><StatusBadge status={item.visibility} /></td>
                  <td>{item.fileSize}</td>
                  <td>{item.downloadCount}</td>
                  <td>{item.updatedAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-icon--sm" onClick={() => openDetail(item)} title="View">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-icon--sm" onClick={() => openEditModal(item)} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button className="btn-icon btn-icon--sm btn-icon--danger" onClick={() => deleteContent(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">No content found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Content Details" size="lg">
        {viewingItem && (
          <div className="detail-grid">
            <div className="detail-row">
              <span className="detail-label">Title</span>
              <span className="detail-value">{viewingItem.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Description</span>
              <span className="detail-value">{viewingItem.description}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Type</span>
              <span className="detail-value"><StatusBadge status={viewingItem.type} variant="content-type" /></span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">{getCategoryName(viewingItem.category)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">File</span>
              <span className="detail-value">{viewingItem.fileName} ({viewingItem.fileSize})</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Visibility</span>
              <span className="detail-value"><StatusBadge status={viewingItem.visibility} /></span>
            </div>
            {viewingItem.visibility === 'selected-dealers' && (
              <div className="detail-row">
                <span className="detail-label">Assigned Dealers</span>
                <span className="detail-value">
                  {viewingItem.assignedDealers.map(dId => {
                    const d = dealers.find(dl => dl.id === dId);
                    return d?.name || dId;
                  }).join(', ')}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Tags</span>
              <span className="detail-value">
                <div className="tag-list">
                  {viewingItem.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Language</span>
              <span className="detail-value">{viewingItem.language}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Version</span>
              <span className="detail-value">{viewingItem.version}</span>
            </div>
            {viewingItem.boatModel && (
              <div className="detail-row">
                <span className="detail-label">Boat Model</span>
                <span className="detail-value">{viewingItem.boatModel}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Uploaded by</span>
              <span className="detail-value">{viewingItem.uploadedBy} on {viewingItem.uploadedAt}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Downloads</span>
              <span className="detail-value">{viewingItem.downloadCount}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Content' : 'Add New Content'}
        size="lg"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ContentType })}
              >
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="brochure">Brochure</option>
                <option value="3d-model">3D Model</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>File Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.fileName}
                onChange={e => setFormData({ ...formData, fileName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>File Size</label>
              <input
                type="text"
                className="form-input"
                value={formData.fileSize}
                onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g. 4.2 MB"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <input
                type="text"
                className="form-input"
                value={formData.language}
                onChange={e => setFormData({ ...formData, language: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Version</label>
              <input
                type="text"
                className="form-input"
                value={formData.version}
                onChange={e => setFormData({ ...formData, version: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Boat Model</label>
            <input
              type="text"
              className="form-input"
              value={formData.boatModel || ''}
              onChange={e => setFormData({ ...formData, boatModel: e.target.value })}
              placeholder="e.g. Oceanus 55"
            />
          </div>
          <div className="form-group">
            <label>Visibility</label>
            <select
              className="form-select"
              value={formData.visibility}
              onChange={e => setFormData({ ...formData, visibility: e.target.value as ContentItem['visibility'] })}
            >
              <option value="all-dealers">All Dealers</option>
              <option value="selected-dealers">Selected Dealers</option>
              <option value="internal">Internal Only</option>
            </select>
          </div>
          {formData.visibility === 'selected-dealers' && (
            <div className="form-group">
              <label>Assign to Dealers</label>
              <div className="checkbox-list">
                {dealers.filter(d => d.status === 'active').map(d => (
                  <label key={d.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.assignedDealers.includes(d.id)}
                      onChange={e => {
                        const updated = e.target.checked
                          ? [...formData.assignedDealers, d.id]
                          : formData.assignedDealers.filter(id => id !== d.id);
                        setFormData({ ...formData, assignedDealers: updated });
                      }}
                    />
                    <span>{d.name} ({d.country})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <div className="tag-list">
                {formData.tags.map(t => (
                  <span key={t} className="tag tag--removable" onClick={() => handleRemoveTag(t)}>
                    {t} &times;
                  </span>
                ))}
              </div>
              <div className="tag-input-row">
                <input
                  type="text"
                  className="form-input"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                />
                <button type="button" className="btn btn--secondary" onClick={handleAddTag}>Add</button>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create Content'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
