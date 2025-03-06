
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Content from "@/pages/Content";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

interface AppDocument {
  id: number;
  title: string;
  date: string;
  score: number;
  type: string;
  assignee: string;
  tags: string[];
  content: string;
}

const demoDocument: AppDocument = {
  id: 0,
  title: "Demo: Company Growth Announcement",
  date: "Just now",
  score: 92,
  type: "Blog",
  assignee: "John",
  tags: ["company", "growth"],
  content: "Demo content about company growth..."
};

function App() {
  const [documents, setDocuments] = useState<AppDocument[]>(() => {
    try {
      const saved = localStorage.getItem('contentlens-documents');
      const parsed = saved ? JSON.parse(saved) : [demoDocument];
      console.log('Loading documents from storage:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error loading documents from storage:', error);
      return [demoDocument];
    }
  });

  useEffect(() => {
    try {
      console.log('Saving documents to storage:', documents);
      localStorage.setItem('contentlens-documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents to storage:', error);
    }
  }, [documents]);

  const handleAddDocument = (title: string) => {
    setDocuments(prevDocuments => {
      const newId = prevDocuments.length > 0 
        ? Math.max(...prevDocuments.map(doc => doc.id)) + 1 
        : 1;
        
      const newDocument: AppDocument = {
        id: newId,
        title,
        date: "Just now",
        score: Math.floor(Math.random() * 15) + 85,
        type: "New",
        assignee: "Unassigned",
        tags: [],
        content: ""
      };
      
      return [newDocument, ...prevDocuments];
    });
  };

  const handleRemoveDocument = (id: number) => {
    if (id === 0) return;
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login />} 
        />
        <Route 
          path="/index" 
          element={
            <ProtectedRoute>
              <Index 
                documents={documents}
                onAddDocument={handleAddDocument}
                onRemoveDocument={handleRemoveDocument}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/content" 
          element={
            <ProtectedRoute>
              <Content 
                documents={documents}
                onAddDocument={handleAddDocument}
                onRemoveDocument={handleRemoveDocument}
              />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
