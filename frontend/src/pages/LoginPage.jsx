import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => (
  <div className="w-full">
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        className={`peer w-full h-12 px-4 pt-3 pb-2 border rounded-[8px] text-gray-900 bg-gray-100 placeholder-transparent focus:outline-none focus:ring-1
          ${
            error && touched
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-gray-400"
          }`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 -top-2 px-1 bg-gray-200 text-sm transition-all duration-200
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:px-0
          peer-focus:-top-2 peer-focus:text-sm peer-focus:px-2
          ${error && touched ? "text-red-500" : "text-gray-500 peer-focus:text-gray-500"}
        `}
      >
        {label}
      </label>
    </div>
    <div className="h-1 mt-1">
      {touched && error && (
        <p className="text-red-500 text-sm text-left px-5">{error}</p>
      )}
    </div>
  </div>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuthStore();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (field) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    setTouchedFields({ email: true, password: true });

    if (Object.keys(newErrors).length === 0) {
      const result = await login(formData);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, [result.field]: result.message }));
        setTouchedFields((prev) => ({ ...prev, [result.field]: true }));
      }
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-6">
      <div className="w-full max-w-md bg-gray-200 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <LogIn className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue your journey</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FloatingInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            touched={touchedFields.email}
          />

          <div className="relative w-full">
            <FloatingInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              touched={touchedFields.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
