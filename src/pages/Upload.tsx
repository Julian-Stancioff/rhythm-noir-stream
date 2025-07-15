import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, File, X, Check, Music, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
  format: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileFormat = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'UNKNOWN';
  };

  const simulateUpload = (file: UploadedFile) => {
    const steps = 20;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, progress }
            : f
        )
      );
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'success', progress: 100, duration: Math.floor(Math.random() * 300) + 120 }
              : f
          )
        );
      }
    }, 100);
  };

  const handleFiles = useCallback((files: FileList) => {
    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || 
      ['.mp3', '.wav', '.flac', '.m4a', '.aac'].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );

    const newFiles: UploadedFile[] = audioFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      format: getFileFormat(file.name),
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload for each file
    newFiles.forEach(file => {
      setTimeout(() => simulateUpload(file), Math.random() * 1000);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">Upload Music</h1>
        <p className="text-muted-foreground">
          Add new tracks to your library
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                    ${isDragOver 
                      ? 'border-primary bg-primary/5 shadow-glow' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            type="file"
            multiple
            accept="audio/*,.mp3,.wav,.flac,.m4a,.aac"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <UploadIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isDragOver ? 'Drop your files here' : 'Upload your music'}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop your audio files or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports MP3, WAV, FLAC, M4A, AAC
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h2>
            
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-card rounded-xl p-4 border border-border animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{file.format}</span>
                        <span>{formatFileSize(file.size)}</span>
                        {file.duration && (
                          <span>{formatDuration(file.duration)}</span>
                        )}
                      </div>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Uploading...</span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                          <div className="w-full bg-progress-bg rounded-full h-1">
                            <div
                              className="bg-primary h-1 rounded-full transition-all duration-200"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive 
                                 hover:bg-destructive/10 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {uploadedFiles.every(f => f.status === 'success') && uploadedFiles.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/library')}
                  className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl 
                           shadow-glow hover:shadow-glow hover:scale-105 
                           transition-all duration-200 font-medium"
                >
                  View in Library
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};