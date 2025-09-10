import React from 'react';
import { Education } from '@/types/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GraduationCap } from 'lucide-react';

interface EducationCardProps {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({ education, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{education.degree}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> {education.institution}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{education.field_of_study}</span>
          <span>{education.period}</span>
        </div>
      </CardContent>
    </Card>
  );
};