import {
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";

export function useLiveLoader<T>() {
  const { pathname } = useResolvedPath(".");
  const data = useEventSource(`/events${pathname}`);

  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
  }, [data, revalidate]);

  return useLoaderData<T>();
}
