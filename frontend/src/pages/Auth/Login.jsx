import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import { setLoading, SetError, setUserAndToken } from "@/features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    // Handle login logic here
    try {
      const response = await login(formData);
      console.log(response.data);
      dispatch(
        setUserAndToken({
          user: response.data.user,
          token: response.data.accessToken,
        })
      );
      // Navigate to the home page or dashboard
      navigate("/");
      toast.success("Login successful!");
      setFormData({ email: "", password: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch(SetError(message));
      toast.error(message);
      console.error("Login failed:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle input changes here
  return (
    <div className="flex items-center justify-center gap-6 w-full py-24">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && (
                <div className="flex flex-col gap-3">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button disabled={loading} type="submit" className="w-full">
                  <span>{loading ? "Loading..." : "Login"}</span>
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
