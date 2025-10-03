import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface FileUploadProps {
  onFileUploaded: (url: string, type: 'image' | 'video') => void;
  accept?: string;
  maxSize?: number; // en MB
}

export function FileUpload({ onFileUploaded, accept = "image/*,video/*", maxSize = 50 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Le fichier est trop volumineux. Taille maximum: ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        onFileUploaded(result.url, fileType);
      } else {
        alert('Erreur lors de l\'upload: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload du fichier');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <VideoIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Images et vidéos acceptées (max {maxSize}MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
