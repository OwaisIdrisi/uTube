import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Upload, X, ImageIcon, Check } from "lucide-react";
import { uploadVideo } from "@/api/video";

export function VideoUploadDialog({ open, onOpenChange }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // category: "",

    // tags: "",
  });

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      // Auto-generate title from filename
      setFormData((prev) => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleThumbnailSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedThumbnail(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo || !formData.title) return;
    // Prepare form data
    const formDataObj = new FormData();
    formDataObj.append("videoFile", selectedVideo);
    formDataObj.append("thumbnail", selectedThumbnail);
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    // formDataObj.append("category", formData.category);
    // formDataObj.append("tags", formData.tags);
    //  upload logic
    try {
      const response = await uploadVideo(formDataObj);
      console.log("Upload response:", response);
    } catch (error) {
      console.log("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      return;
    }

    uploadVideo(formDataObj);

    setIsUploading(true);
    setUploadProgress(0);
    console.log(formDataObj);
    // Simulate upload progress

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const resetForm = () => {
    setSelectedVideo(null);
    setSelectedThumbnail(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setFormData({
      title: "",
      description: "",
      // category: "",
      // privacy: "public",
      tags: "",
    });
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (uploadComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="size-5 text-green-500" />
              Upload Complete!
            </DialogTitle>
            <DialogDescription>
              Your video has been uploaded successfully and is now processing.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button onClick={handleClose} className="flex-1">
              Upload Another
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Share your content with the world. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video Upload Section */}
          <div className="space-y-4">
            <div>
              <Label>Video File</Label>
              {!selectedVideo ? (
                <Card
                  className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Upload className="size-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Select video to upload
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Or drag and drop a video file
                    </p>
                    <span className="text-sm text-white bg-primary py-1 px-2 rounded">
                      MP4, MOV, AVI up to 50MB
                    </span>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedVideo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVideo(null);
                        setVideoPreview(null);
                        if (videoInputRef.current)
                          videoInputRef.current.value = "";
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label>Custom Thumbnail Optional</Label>
              <Card
                className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <CardContent className="p-4">
                  {!thumbnailPreview ? (
                    <div className="flex items-center gap-3">
                      <ImageIcon className="size-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Upload thumbnail</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG up to 2MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="relative size-16 rounded overflow-hidden">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{selectedThumbnail?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Custom thumbnail
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedThumbnail(null);
                          setThumbnailPreview(null);
                          if (thumbnailInputRef.current)
                            thumbnailInputRef.current.value = "";
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Video Details Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter video title"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Tell viewers about your video"
                rows={4}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            {/* <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Add tags separated by commas"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Help people find your video
              </p>
            </div> */}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              !selectedVideo ||
              !formData.title ||
              isUploading ||
              !thumbnailInputRef.current?.value
            }
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
