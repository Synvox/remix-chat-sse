import {
  useLoaderData,
  useLocation,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils";

export function useLiveLoader<T>() {
  const { pathname } = useResolvedPath(".");
  const data = useEventSource(`/events${pathname}`);

  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
  }, [data, revalidate]);

  return useLoaderData<T>();
}
