
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: number;
  title: string;
  date: string;
  type: string;
  assignee: string;
  tags: string[];
  content: string;
  score: number;
}

interface DocumentTableProps {
  documents: Document[];
}

export const DocumentTable = ({ documents }: DocumentTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (doc: Document) => {
    navigate('/content', { 
      state: { 
        title: doc.title,
        content: doc.content
      } 
    });
  };

  return (
    <ScrollArea className="h-full w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow 
              key={doc.id}
              onClick={() => handleRowClick(doc)}
              className="cursor-pointer hover:bg-slate-50"
            >
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{doc.assignee}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
