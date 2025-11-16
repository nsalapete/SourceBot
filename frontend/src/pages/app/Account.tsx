import { User as UserIcon, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>My Account</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your personal and professional information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                defaultValue="Nicolas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                defaultValue="Salapete"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="nicolas_salapete@hmail.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enterprise">Enterprise</Label>
              <Input
                id="enterprise"
                defaultValue="SERICA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                defaultValue="CEO"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Profile Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              defaultValue="CEO at SERICA; passionate about technology, music and innovation. Part-time failed stand-up comedian."
            />
          </div>

          <Button>Save Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
