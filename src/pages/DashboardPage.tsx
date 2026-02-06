import {
  FileText,
  Users,
  Download,
  FolderTree,
  Upload,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { activityLog } from '../data/mockData';

export function DashboardPage() {
  const { content, dealers, categories } = useApp();

  const totalDownloads = content.reduce((sum, c) => sum + c.downloadCount, 0);
  const activeDealers = dealers.filter(d => d.status === 'active').length;
  const pendingDealers = dealers.filter(d => d.status === 'pending').length;

  const stats = [
    { label: 'Total Content', value: content.length, icon: FileText, color: '#2563eb' },
    { label: 'Active Dealers', value: activeDealers, icon: Users, color: '#059669' },
    { label: 'Total Downloads', value: totalDownloads, icon: Download, color: '#7c3aed' },
    { label: 'Categories', value: categories.length, icon: FolderTree, color: '#d97706' },
    { label: 'Recent Uploads', value: 4, icon: Upload, color: '#dc2626' },
    { label: 'Pending Dealers', value: pendingDealers, icon: Clock, color: '#0891b2' },
  ];

  const actionIcons: Record<string, string> = {
    upload: 'Uploaded',
    download: 'Downloaded',
    dealer_added: 'Added dealer',
    access_granted: 'Granted access',
  };

  const recentContent = [...content]
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '15', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-list">
            {activityLog.map(log => (
              <div key={log.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <p>
                    <strong>{log.user}</strong> {actionIcons[log.action] || log.action}{' '}
                    <strong>{log.target}</strong>
                  </p>
                  {log.details && <p className="activity-details">{log.details}</p>}
                  <span className="activity-time">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Recently Updated Content</h2>
          <div className="recent-content-list">
            {recentContent.map(item => (
              <div key={item.id} className="recent-content-item">
                <div className="recent-content-info">
                  <span className="recent-content-title">{item.title}</span>
                  <span className="recent-content-meta">
                    {item.type} &middot; {item.fileSize} &middot; v{item.version}
                  </span>
                </div>
                <span className="recent-content-date">{item.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
