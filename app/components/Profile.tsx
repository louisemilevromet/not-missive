"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

const Profile = ({ user }: { user: any }) => {
  const updateUser = useMutation(api.users.updateUser);
  const userInfo = user;
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userInfo._valueJSON.firstName,
      lastName: userInfo._valueJSON.lastName,
    },
    mode: "onChange",
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateUser({
      userId: userInfo._valueJSON.userId,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    setEditingFirstName(false);
    setEditingLastName(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 p-4 flex items-center bg-[#F9F9F9] gap-2 border-b">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Profile</h1>
      </header>

      <div className="flex-1 container max-w-4xl mx-auto mt-16">
        <Alert className="mb-6 bg-blue-50 text-blue-900 border-blue-100">
          <AlertDescription>
            Updating your profile will update it across all organizations.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 bg-primary">
            <AvatarImage src={userInfo._valueJSON.profileImage} />
          </Avatar>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 w-full">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!editingFirstName}
                            placeholder="Enter your first name"
                            className="w-full"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (editingFirstName) {
                              form.handleSubmit(onSubmit)();
                            } else {
                              setEditingFirstName(true);
                            }
                          }}
                        >
                          {editingFirstName ? (
                            <SaveIcon className="h-4 w-4" />
                          ) : (
                            <PencilIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{
                    required: "Last name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!editingLastName}
                            placeholder="Enter your last name"
                            className="w-full"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (editingLastName) {
                              form.handleSubmit(onSubmit)();
                            } else {
                              setEditingLastName(true);
                            }
                          }}
                        >
                          {editingLastName ? (
                            <SaveIcon className="h-4 w-4" />
                          ) : (
                            <PencilIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
