const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (!username || !password) {
    setError("Please enter both username and password.");
    setIsLoading(false);
    return;
  }

  try {
    const result = await login(username, password);

    if (result.success) {
      const targetRole = result.role || result.user?.role || role;

      switch (targetRole) {
        case "client":
          navigate("/client");
          break;
        case "artist":
          navigate("/artist");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } else {
      setError(result.error || "Login failed.");
    }
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login failed."
    );
  } finally {
    setIsLoading(false);
  }
};