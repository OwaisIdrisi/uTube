import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { register } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { SetError, setLoading } from "@/features/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const {loading, error} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formDetail, setFormDetail] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(false);
  const [selectedCover, setSelectedsetCover] = useState(false);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    setSelectedAvatar(file);
    console.log(file);
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    setSelectedsetCover(file);
    console.log(file);
  };

  const handleChange = (e) => {
    setFormDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAvatar) toast.error("Please select an avatar image.");
      dispatch(setLoading(true));

    const { fullName, username, email, password } = formDetail;
    const formData = new FormData();
    formData.append("avatar", selectedAvatar);
    formData.append("coverImage", selectedCover);
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await register(formData);
      console.log(response.data);
      toast.success("Registration successful! Please login.");
      setFormDetail({
        fullName: "",
        username: "",
        email: "",
        password: "",
      });
      setSelectedAvatar(null);
      setSelectedsetCover(null);
      navigate("/login");
      dispatch(setLoading(false));
    } catch (error) {
      const message = error?.response?.data?.message || "Register failed";
      dispatch(SetError(message));
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 w-full py-4 md:py-10">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formDetail.fullName}
                  placeholder="John Doe"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={formDetail.username}
                  placeholder="johndoe123"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formDetail.email}
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formDetail.password}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  onChange={handleAvatarSelect}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="banner">Cover</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  onChange={handleCoverSelect}
                />
              </div>
               {error && (
                <div className="flex flex-col gap-3">
                  <p className="text-red-500">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <Button disabled={loading}  type="submit" className="w-full">
                 { loading ? "loading..." : "Register"}
                </Button>
                <Button disabled={loading} variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
