import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import type { Category } from '../types';

const emptyCategory: Omit<Category, 'id'> = {
  name: '',
  description: '',
  contentCount: 0,
};

export function CategoriesPage() {
  const { categories, content, addCategory, updateCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(emptyCategory);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(emptyCategory);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData(cat);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingCategory) {
      updateCategory({ ...editingCategory, ...formData });
    } else {
      addCategory({ ...formData, id: `cat${Date.now()}` } as Category);
    }
    setIsModalOpen(false);
  };

  const getContentCount = (catId: string) => {
    return content.filter(c => c.category === catId).length;
  };

  return (
    <div className="categories-page">
      <div className="page-toolbar">
        <h2 className="page-subtitle">Manage content categories and organize your media library</h2>
        <button className="btn btn--primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-card-icon">
              <FolderOpen size={32} />
            </div>
            <h3 className="category-card-name">{cat.name}</h3>
            <p className="category-card-description">{cat.description}</p>
            <div className="category-card-stats">
              <span className="category-content-count">{getContentCount(cat.id)} items</span>
            </div>
            <div className="category-card-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => openEditModal(cat)}>
                <Pencil size={14} /> Edit
              </button>
              <button className="btn btn--danger btn--sm" onClick={() => deleteCategory(cat.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="sm"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Technical Specifications"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of this category..."
            />
          </div>
          <div className="form-actions">
            <button className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
