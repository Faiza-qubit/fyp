import { Route } from "wouter";

export default function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      component={(props) => {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          const redirectPath = window.location.pathname.replace("/", "");
          window.location.href = `/login?redirect=${redirectPath}`;
          return null;
        }

        return <Component {...props} />;
      }}
    />
  );
}