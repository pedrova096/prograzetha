const getPathSegments = (path: string): string[] =>
  path.split('/').filter(Boolean);

export const matchesRoute = (pathname: string, route: string): boolean => {
  const pathnameSegments = getPathSegments(pathname);
  const routeSegments = getPathSegments(route);

  return (
    pathnameSegments.length === routeSegments.length &&
    routeSegments.every(
      (segment, index) =>
        segment.startsWith(':') || segment === pathnameSegments[index],
    )
  );
};
