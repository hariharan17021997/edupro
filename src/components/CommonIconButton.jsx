import React from "react";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink } from "react-router-dom";

// CommonIconButton wraps MUI IconButton and optionally uses react-router Link when a "to" prop is provided.
// Props:
// - to: (string) optional — when provided, the underlying component becomes a RouterLink.
// - component: (element) optional — override component, honored over `to`.
// - children: icon node
// - and any other MUI IconButton props such as 'aria-label', 'edge', 'color', 'sx', etc.

export default function CommonIconButton({ to, component, children, ...rest }) {
  // If a `component` is explicitly provided, keep it. Otherwise if `to` prop is provided use RouterLink.
  const props = { ...rest };
  if (!component && to) {
    props.component = RouterLink;
    props.to = to;
  } else if (component) {
    props.component = component;
    if (to) props.to = to; // allow both when component also expects a 'to'
  }

  return <IconButton {...props}>{children}</IconButton>;
}
