import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ContentItem, Dealer, Category, User } from '../types';
import { contentItems as initialContent, dealers as initialDealers, categories as initialCategories, currentUser } from '../data/mockData';

interface AppState {
  user: User;
  content: ContentItem[];
  dealers: Dealer[];
  categories: Category[];
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addContent: (item: ContentItem) => void;
  updateContent: (item: ContentItem) => void;
  deleteContent: (id: string) => void;
  addDealer: (dealer: Dealer) => void;
  updateDealer: (dealer: Dealer) => void;
  deleteDealer: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const login = useCallback((email: string, _password: string) => {
    if (email && _password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const addContent = useCallback((item: ContentItem) => {
    setContent(prev => [item, ...prev]);
  }, []);

  const updateContent = useCallback((item: ContentItem) => {
    setContent(prev => prev.map(c => c.id === item.id ? item : c));
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContent(prev => prev.filter(c => c.id !== id));
  }, []);

  const addDealer = useCallback((dealer: Dealer) => {
    setDealers(prev => [dealer, ...prev]);
  }, []);

  const updateDealer = useCallback((dealer: Dealer) => {
    setDealers(prev => prev.map(d => d.id === dealer.id ? dealer : d));
  }, []);

  const deleteDealer = useCallback((id: string) => {
    setDealers(prev => prev.filter(d => d.id !== id));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories(prev => [...prev, category]);
  }, []);

  const updateCategory = useCallback((category: Category) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      content,
      dealers,
      categories,
      isAuthenticated,
      login,
      logout,
      addContent,
      updateContent,
      deleteContent,
      addDealer,
      updateDealer,
      deleteDealer,
      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
