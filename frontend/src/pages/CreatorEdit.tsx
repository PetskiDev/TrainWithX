import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  ShoppingCart,
  Award,
  TrendingUp,
  Camera,
  Save,
  X,
  ArrowLeft
} from "lucide-react";
import type { CreatorPostDTO, CreatorPreviewDTO } from "@shared/types/creator";
import { toast } from "@frontend/hooks/use-toast";

// Mock creator data for editing


const CreatorEdit = () => {
  const { state } = useLocation();
  const creator = state?.creator as CreatorPreviewDTO;
  if (!creator) {
    return <div>Error: No creator data found.</div>;
  }
  const [isEditing, setIsEditing] = useState(true);
  const [editData, setEditData] = useState({
    name: creator.username,
    bio: creator.bio,
    specialties: creator.specialties.join(", "),
    yearsExperience: creator.yearsXP.toString(),
  });
  const [avatarPreview, setAvatarPreview] = useState(creator.avatarUrl);
  const [coverPreview, setCoverPreview] = useState(creator.coverUrl);



  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverPreview(imageUrl);
    }
  };

  const handleSave = async () => {
    try {
      const payload: CreatorPostDTO = {
        bio: editData.bio?.trim() || undefined,
        specialties: editData.specialties
          ?.split(",")
          .map(s => s.trim())
          .filter(Boolean),
        yearsXP: parseFloat(editData.yearsExperience || "0") || undefined,
      };

      const response = await fetch(`/api/v1//creators/${creator.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update creator');
      }

      const updated = await response.json();
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error saving creator:", error.message);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: creator.username,
      bio: creator.bio,
      specialties: creator.specialties.join(", "),
      yearsExperience: creator.yearsXP.toString(),
    });
    //setAvatarPreview(mockCreator.avatar);
    //setCoverPreview(mockCreator.coverImage);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/me/creator">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Creator Profile</h1>
                <p className="text-muted-foreground">Update your profile information</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={coverPreview}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <div className="absolute top-4 right-4">
            <label htmlFor="cover-upload" className="cursor-pointer">
              <div className="bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors">
                <Camera className="h-5 w-5" />
              </div>
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Creator Profile Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={avatarPreview} alt={editData.name} />
              <AvatarFallback className="text-2xl font-bold">
                {editData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Creator Info */}
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-4xl md:text-5xl font-bold h-auto p-2 mt-1"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold">
                  {editData.name}
                </h1>
              )}
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px] mt-1"
                  placeholder="Tell people about yourself..."
                />
              ) : (
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                  {editData.bio}
                </p>
              )}
            </div>

            {/* Stats (Read-only) */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{creator.totalSales.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">total purchases</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{creator.rating}</span>
                <span className="text-sm text-muted-foreground">rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="w-16 h-6 p-1 text-center"
                    type="number"
                  />
                ) : (
                  <span className="font-semibold">{editData.yearsExperience}</span>
                )}
                <span className="text-sm text-muted-foreground">years experience</span>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <Label htmlFor="specialties" className="text-sm font-medium">Specialties</Label>
              {isEditing ? (
                <Input
                  id="specialties"
                  value={editData.specialties}
                  onChange={(e) => handleInputChange('specialties', e.target.value)}
                  placeholder="e.g., Muscle Building, Strength Training, Nutrition"
                  className="mt-1"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editData.specialties.split(', ').map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{creator.totalSales.toLocaleString()}</h3>
              <p className="text-muted-foreground">Total Purchases</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{creator.rating}/5</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{creator.plansCount}</h3>
              <p className="text-muted-foreground">Training Plans Published</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorEdit;