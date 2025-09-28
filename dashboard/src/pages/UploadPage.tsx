import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Video, Link, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Module {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'youtube';
  category: string;
  file?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
  youtubeUrl?: string;
  status: 'active' | 'pending' | 'inactive';
  views: number;
  createdAt: string;
  uploadedBy: {
    name: string;
    email: string;
    department: string;
  };
}

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploadType, setUploadType] = useState<'pdf' | 'video' | 'youtube'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { token, user } = useAuth();
  
  const categories = [
    'Natural Disasters',
    'Fire Safety',
    'Medical Emergency',
    'Evacuation Procedures',
    'Communication Protocols',
    'First Aid',
    'General Preparedness'
  ];

  // Fetch modules from backend
  const fetchModules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/modules');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setModules(result.data.modules || []);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch modules",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch modules error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type based on uploadType
      if (uploadType === 'pdf' && selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        e.target.value = ''; // Reset file input
        return;
      }
      
      if (uploadType === 'video' && !selectedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid File",
          description: "Please select a video file",
          variant: "destructive",
        });
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size
      const maxSize = uploadType === 'pdf' ? 50 * 1024 * 1024 : 100 * 1024 * 1024; // 50MB for PDF, 100MB for video
      if (selectedFile.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        e.target.value = ''; // Reset file input
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (uploadType !== 'youtube' && !file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (uploadType === 'youtube' && !youtubeUrl) {
      toast({
        title: "Missing YouTube URL",
        description: "Please provide a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload modules",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('type', uploadType);
      
      if (uploadType === 'youtube') {
        formData.append('youtubeUrl', youtubeUrl);
      } else if (file) {
        formData.append('file', file);
      }

      const response = await fetch('http://localhost:5000/api/modules', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: "Your module has been uploaded successfully",
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setUploadType('pdf');
        setFile(null);
        setYoutubeUrl('');
        
        // Refresh modules list
        await fetchModules();
      } else {
        toast({
          title: "Upload Failed",
          description: result.message || "Failed to upload module",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) {
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete modules",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Deleted",
          description: "Module deleted successfully",
        });
        fetchModules();
      } else {
        toast({
          title: "Delete Failed",
          description: result.message || "Failed to delete module",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'youtube':
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Upload Educational Modules</h1>
        <p className="text-muted-foreground">
          Upload training materials, videos, and educational content for disaster preparedness
        </p>
        {!token && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              You need to be logged in to upload modules
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Module
            </CardTitle>
            <CardDescription>
              Add new educational content for schools and colleges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Module Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter module title"
                  required
                  disabled={!token}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter module description"
                  rows={3}
                  disabled={!token}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required disabled={!token}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Type *</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant={uploadType === 'pdf' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUploadType('pdf');
                      setFile(null);
                      setYoutubeUrl('');
                    }}
                    disabled={!token}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUploadType('video');
                      setFile(null);
                      setYoutubeUrl('');
                    }}
                    disabled={!token}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === 'youtube' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUploadType('youtube');
                      setFile(null);
                    }}
                    disabled={!token}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    YouTube
                  </Button>
                </div>
              </div>

              {uploadType === 'youtube' ? (
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL *</Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    disabled={!token}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {uploadType === 'pdf' ? 'PDF File' : 'Video File'} *
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept={uploadType === 'pdf' ? '.pdf' : 'video/*'}
                    onChange={handleFileChange}
                    required
                    disabled={!token}
                  />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{file.name}</span>
                      <span>({formatFileSize(file.size)})</span>
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isUploading || !token}>
                {isUploading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : !token ? (
                  "Please Login to Upload"
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Module
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded Modules List */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Uploaded Modules</CardTitle>
            <CardDescription>
              Manage your uploaded educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No modules uploaded yet</p>
                  <p className="text-sm">Upload your first module using the form</p>
                </div>
              ) : (
                modules.map((module) => (
                  <div key={module._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(module.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{module.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {module.category} • {module.views.toLocaleString()} views
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {formatDate(module.createdAt)} by {module.uploadedBy?.name || 'Unknown'}
                          </p>
                          {module.type !== 'youtube' && module.file && (
                            <p className="text-xs text-muted-foreground truncate">
                              {module.file.originalName} ({formatFileSize(module.file.size)})
                            </p>
                          )}
                          {module.type === 'youtube' && module.youtubeUrl && (
                            <p className="text-xs text-muted-foreground truncate">
                              {module.youtubeUrl}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className={getStatusColor(module.status)}>
                          {module.status}
                        </Badge>
                        {token && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteModule(module._id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;