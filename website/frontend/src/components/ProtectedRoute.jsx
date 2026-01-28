import { Redirect, Route } from "wouter";

export default function ProtectedRoute({ component: Component, isLoggedIn, ...props }) {
  return isLoggedIn ? <Route {...props} component={Component} /> : <Redirect to="/login" />;
}
