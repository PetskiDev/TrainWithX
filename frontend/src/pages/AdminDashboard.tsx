import { useState } from "react";
import { Search, Users, TrendingUp, FileText, Shield, UserCheck, Plus, Eye, Edit, Trash2, Crown, BarChart3, DollarSign, CheckCircle, XCircle, ChevronDown, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAdminDashboardData } from "@frontend/hooks/useAdminDashboardData";
import { getUserRole } from "@frontend/lib/role";
import type { UserDto } from "@shared/types/user";
import type { PlanCreatorData } from "@shared/types/plan";
import type { CreatorApplicationDTO } from "@shared/types/creator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";



const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [planSearchQuery, setPlanSearchQuery] = useState("");
  const [userSortBy, setUserSortBy] = useState("username");
  const [planSortBy, setPlanSortBy] = useState("title");
  const [creatorSortBy, setCreatorSortBy] = useState("username");


  const { stats, users, plans, applications, loading, creators, refetch } = useAdminDashboardData();
  const [showPromoteDialog, setShowPromoteDialog] = useState<boolean>(false);
  const [promotionSubdomain, setPromotionSubdomain] = useState<string>("");
  const [userToPromote, setUserToPromote] = useState<UserDto | null>(null);


  const { toast } = useToast();

  if (loading || !stats) return <>Loading data</>;


  const filteredAndSortedUsers = users
    .filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (userSortBy) {
        case "username": return a.username.localeCompare(b.username);
        case "email": return a.email.localeCompare(b.email);
        case "role": return getUserRole(a).localeCompare(getUserRole(b));
        case "joinDate": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  const filteredAndSortedPlans = plans
    .filter(plan =>
      plan.title.toLowerCase().includes(planSearchQuery.toLowerCase()) ||
      plan.creatorUsername.toLowerCase().includes(planSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (planSortBy) {
        case "title": return a.title.localeCompare(b.title);
        case "creator": return a.creatorUsername.localeCompare(b.creatorUsername);
        case "created": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "sales": return b.sales - a.sales;
        case "revenue": return b.revenue - a.revenue;
        default: return 0;
      }
    });

  const filteredAndSortedCreators = creators
    .filter(c =>
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (creatorSortBy) {
        case "username":
          return a.username.localeCompare(b.username);
        case "plans":
          return b.plansCount - a.plansCount;
        case "sales":
          return b.totalSales - a.totalSales;
        case "revenue":
          return (b as any).revenue - (a as any).revenue; // only if you extend DTO
        case "rating":
          return Number(b.rating) - Number(a.rating);
        default:
          return 0;
      }
    });
  const handlePromoteToCreator = (subdomain: string) => {
    if (!userToPromote) return;
    toast({
      title: "User Promoted",
      description: `${userToPromote.username} has been promoted to creator status with subdomain: ${subdomain}`,

    });
    setShowPromoteDialog(false);
    setPromotionSubdomain("");
    //TODO API CALL
  };
  const handlePromoteClick = (user: UserDto) => {
    setUserToPromote(user);
    setShowPromoteDialog(true);
  };

  const handleCancelPromotion = () => {
    setShowPromoteDialog(false);
    setPromotionSubdomain("");
    setUserToPromote(null);
  };

  const handleSubmitPromotion = () => {
    if (!promotionSubdomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subdomain",
        variant: "destructive",
      });
      return;
    }
    handlePromoteToCreator(promotionSubdomain);
  };

  const handleBanUser = (user: UserDto) => {
    toast({
      title: "User Banned",
      description: `${user.username} has been banned from the platform.`,
      variant: "destructive",
    });
  };

  const handleDeleteUser = async (user: UserDto) => {
    try {
      // Call your API to delete the user
      const res = await fetch(`/api/v1/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user.');
      }

      toast({
        title: "User Deleted",
        description: `${user.username} has been permanently removed from the platform.`,
        variant: "destructive",
      });

      // Optionally update your local state/UI here
      await refetch();
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: `Could not delete ${user.username}. Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeletePlan = async (plan: PlanCreatorData) => {
    try {
      const res = await fetch(`/api/v1/plans/${plan.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete plan.");
      }

      // Remove plan from local state
      await refetch();
      toast({
        title: "Plan Deleted",
        description: `"${plan.title}" has been removed.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Plan",
        description: `Could not delete "${plan.title}". Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handlePublishPlan = (plan: PlanCreatorData) => {
    const action = plan.isPublished ? 'Unpublished' : 'Published';
    toast({
      title: `Plan ${action}`,
      description: `"${plan.title}" has been ${action}.`,
    });
    // In a real app, you'd make an API call here
  };

  const handleApproveCreator = (request: CreatorApplicationDTO) => {
    toast({
      title: "Creator Request Approved",
      description: `${request.fullName} has been approved as a creator.`,
    });
  };

  const handleRejectCreator = (request: CreatorApplicationDTO) => {
    toast({
      title: "Creator Request Rejected",
      description: `${request.fullName}'s creator request has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen-navbar bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Total Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.newUsers} this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold"> Creators</CardTitle>
              <Crown className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">{stats.totalCreators}</div>
              <p className="text-xs text-muted-foreground">+{stats.newCreators} this month</p>
              <p className="text-xs text-muted-foreground">{(100 * stats.totalCreators / stats.totalUsers).toPrecision(3)}% of users</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold"> Training Plans</CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">{stats.totalPlans}</div>
              <p className="text-xs text-muted-foreground">{stats.newPlans} new this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold"> Revenue This Month</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">${stats.newRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total: ${stats.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold"> Total Buys</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">{stats.totalBuys}</div>
              <p className="text-xs text-muted-foreground">+{stats.newBuys} this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold"> Conversion Rate</CardTitle>
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black">100.0%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="plans">Plan Management</TabsTrigger>
            <TabsTrigger value="approve-creators">Approve Creators</TabsTrigger>
            <TabsTrigger value="analytics">Creators</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={userSortBy} onValueChange={setUserSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="username">Sort by Username</SelectItem>
                      <SelectItem value="role">Sort by Role</SelectItem>
                      <SelectItem value="email">Sort by Email</SelectItem>
                      <SelectItem value="joinDate">Sort by Join Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Username</TableHead>
                      <TableHead className="text-left">Email</TableHead>
                      <TableHead className="text-center">Role</TableHead>
                      <TableHead className="text-center">Join Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredAndSortedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-left font-medium">{user.username}</TableCell>
                        <TableCell className="text-left">{user.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              user.isAdmin ? 'destructive' : user.isCreator ? 'default' : 'secondary'
                            }
                          >
                            {getUserRole(user)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {user.isActive ? 'Active' : 'Deactivated'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePromoteClick(user)}
                              className="text-green-600 hover:text-green-700"
                              disabled={getUserRole(user) === 'creator'}

                            >
                              <Crown className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleBanUser(user)}
                                  className="text-orange-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Management */}
          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Plan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search plans..."
                      value={planSearchQuery}
                      onChange={(e) => setPlanSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={planSortBy} onValueChange={setPlanSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Sort by Title</SelectItem>
                      <SelectItem value="creator">Sort by Creator</SelectItem>
                      <SelectItem value="status">Sort by Status</SelectItem>
                      <SelectItem value="created">Sort by Date</SelectItem>
                      <SelectItem value="sales">Sort by Sales</SelectItem>
                      <SelectItem value="revenue">Sort by Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Title</TableHead>
                      <TableHead className="text-left">Creator</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="text-center">Sales</TableHead>
                      <TableHead className="text-center">Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredAndSortedPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="text-left font-medium">{plan.title}</TableCell>
                        <TableCell className="text-left">{plan.creatorUsername}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={plan.isPublished ? 'default' : 'secondary'}>
                            {plan.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{new Date(plan.createdAt).toLocaleDateString()
                        }</TableCell>
                        <TableCell className="text-center">{plan.sales}</TableCell>
                        <TableCell className="text-center">${plan.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublishPlan(plan)}
                              className={
                                plan.isPublished
                                  ? 'text-orange-600 hover:text-orange-700'
                                  : 'text-green-600 hover:text-green-700'
                              }
                            >
                              {plan.isPublished ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePlan(plan)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Approve Creators */}
          <TabsContent value="approve-creators" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approve Creator Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <Card key={application.id} className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-medium">{application.fullName.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{application.fullName}</h3>
                                <p className="text-muted-foreground">{application.email}</p>
                                <p className="text-sm text-muted-foreground">Requested on {new Date(application.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Badge variant="outline">Pending Review</Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-sm mb-1">Wanted Subdomain:</p>
                              <p className="text-sm text-muted-foreground">{application.subdomain}.trainwithx.com</p>
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-1">Specialization:</p>
                              <p className="text-sm text-muted-foreground">{application.specialization}</p>
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-1">Experience:</p>
                              <p className="text-sm text-muted-foreground">{application.experience}</p>
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-1">Certifications:</p>
                              <p className="text-sm text-muted-foreground">{application.certifications || "None provided"}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-sm mb-1">Professional Bio:</p>
                              <p className="text-sm text-muted-foreground">{application.bio}</p>
                            </div>
                            {application.socialMedia && (
                              <div>
                                <p className="font-medium text-sm mb-1">Social Media:</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{application.socialMedia}</p>
                              </div>
                            )}
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">Set Subdomain:</label>
                                <div className="relative">
                                  <Input
                                    placeholder={application.subdomain}
                                    defaultValue={application.subdomain}
                                    className="pr-32"
                                  />
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                    .trainwithx.com
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleApproveCreator(application)}
                                className="min-w-32"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectCreator(application)}
                                variant="outline"
                                className="min-w-32"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <UserCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                      <p className="text-muted-foreground">There are currently no creator requests to review.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Creator Management */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Creator Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search creators..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={creatorSortBy} onValueChange={setCreatorSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="username">Sort by Username</SelectItem>
                      <SelectItem value="plans">Sort by Plans</SelectItem>
                      <SelectItem value="sales">Sort by Sales</SelectItem>
                      <SelectItem value="revenue">Sort by Revenue</SelectItem>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Creator</TableHead>
                      <TableHead className="text-center">Plans</TableHead>
                      <TableHead className="text-center">Sales</TableHead>
                      <TableHead className="text-center">Revenue</TableHead>
                      <TableHead className="text-center">Monthly</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredAndSortedCreators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell className="text-left">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {creator.username.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{creator.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <div className="text-lg font-semibold">{creator.plansCount}</div>
                            <div className="text-xs text-muted-foreground">Published</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <div className="text-lg font-semibold">{creator.totalSales.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Sales</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <div className="text-lg font-semibold">${creator.totalRevenue.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">All Time</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <div className="text-lg font-semibold">${creator.revenueThisMonth.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">This Month</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{creator.rating}</span>
                            <span className="text-xs text-muted-foreground">({creator.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Promote to Creator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter a subdomain for {userToPromote?.username}'s creator profile:
            </p>
            <Input
              placeholder="Enter subdomain (e.g., johndoe)"
              value={promotionSubdomain}
              onChange={(e) => setPromotionSubdomain(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelPromotion}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPromotion}>
              Promote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AdminDashboard;