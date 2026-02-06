import { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';

export function DistributionPage() {
  const { dealers, categories, content, updateContent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDealer, setExpandedDealer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeDealers = dealers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    return d.status === 'active' && matchesSearch;
  });

  const filteredContent = content.filter(c => {
    return selectedCategory === 'all' || c.category === selectedCategory;
  });

  const toggleDealer = (dealerId: string) => {
    setExpandedDealer(expandedDealer === dealerId ? null : dealerId);
  };

  const isDealerAssigned = (dealerId: string, contentId: string) => {
    const item = content.find(c => c.id === contentId);
    if (!item) return false;
    return item.visibility === 'all-dealers' || item.assignedDealers.includes(dealerId);
  };

  const toggleContentAccess = (dealerId: string, contentItem: typeof content[0]) => {
    if (contentItem.visibility === 'all-dealers') return;

    const isAssigned = contentItem.assignedDealers.includes(dealerId);
    const updatedDealers = isAssigned
      ? contentItem.assignedDealers.filter(id => id !== dealerId)
      : [...contentItem.assignedDealers, dealerId];

    updateContent({
      ...contentItem,
      visibility: 'selected-dealers',
      assignedDealers: updatedDealers,
    });
  };

  const getDealerContentCount = (dealerId: string) => {
    return content.filter(c =>
      c.visibility === 'all-dealers' || c.assignedDealers.includes(dealerId)
    ).length;
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className="distribution-page">
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
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="distribution-info">
        <Shield size={18} />
        <span>
          Manage which content each dealer can access. Content marked as "All Dealers" is automatically available to everyone.
          Click on a dealer to expand and manage individual content access.
        </span>
      </div>

      <div className="distribution-list">
        {activeDealers.map(dealer => (
          <div key={dealer.id} className="distribution-dealer">
            <div
              className="distribution-dealer-header"
              onClick={() => toggleDealer(dealer.id)}
            >
              <div className="distribution-dealer-info">
                {expandedDealer === dealer.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <div>
                  <span className="distribution-dealer-name">{dealer.name}</span>
                  <span className="distribution-dealer-meta">
                    {dealer.country} &middot; {dealer.region}
                  </span>
                </div>
              </div>
              <div className="distribution-dealer-summary">
                <span className="distribution-count">
                  {getDealerContentCount(dealer.id)} / {content.length} items accessible
                </span>
                <StatusBadge status={dealer.status} />
              </div>
            </div>

            {expandedDealer === dealer.id && (
              <div className="distribution-content-list">
                <table className="table table--compact">
                  <thead>
                    <tr>
                      <th>Content</th>
                      <th>Category</th>
                      <th>Visibility</th>
                      <th>Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.map(item => {
                      const hasAccess = isDealerAssigned(dealer.id, item.id);
                      const isGlobal = item.visibility === 'all-dealers';
                      const isInternal = item.visibility === 'internal';

                      return (
                        <tr key={item.id} className={hasAccess ? '' : 'row--dimmed'}>
                          <td>
                            <span className="distribution-content-title">{item.title}</span>
                          </td>
                          <td>{getCategoryName(item.category)}</td>
                          <td><StatusBadge status={item.visibility} /></td>
                          <td>
                            {isInternal ? (
                              <span className="access-badge access-badge--internal">
                                <XCircle size={14} /> Internal
                              </span>
                            ) : isGlobal ? (
                              <span className="access-badge access-badge--global">
                                <CheckCircle size={14} /> Global
                              </span>
                            ) : (
                              <button
                                className={`access-toggle ${hasAccess ? 'access-toggle--on' : 'access-toggle--off'}`}
                                onClick={() => toggleContentAccess(dealer.id, item)}
                              >
                                {hasAccess ? (
                                  <><CheckCircle size={14} /> Granted</>
                                ) : (
                                  <><XCircle size={14} /> Not granted</>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
