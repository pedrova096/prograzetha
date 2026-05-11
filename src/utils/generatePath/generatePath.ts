import type { ParamsForRoute, PathParam } from "./generatePath.types";

const invariant = (condition: boolean, message: string) =>
  !condition && console.error(condition, message);

const generatePathRouter = <Path extends string>(
  originalPath: Path,
  params: {
    [key in PathParam<Path>]: string | null;
  } = {} as any,
): string => {
  let path: string = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    console.warn(
      false,
      `Route path "${path}" will be treated as if it were ` +
        `"${path.replace(/\*$/, "/*")}" because the \`*\` character must ` +
        `always follow a \`/\` in the pattern. To get rid of this warning, ` +
        `please change the route path to "${path.replace(/\*$/, "/*")}".`,
    );
    path = path.replace(/\*$/, "/*") as Path;
  }

  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith("/") ? "/" : "";

  const stringify = (p: any) =>
    p == null ? "" : typeof p === "string" ? p : String(p);

  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;

      // only apply the splat if it's the last segment
      if (isLastSegment && segment === "*") {
        const star = "*" as PathParam<Path>;
        // Apply the splat
        return stringify(params[star]);
      }

      const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
      if (keyMatch) {
        const [, key, optional] = keyMatch;
        let param = params[key as PathParam<Path>];
        invariant(optional === "?" || param != null, `Missing ":${key}" param`);
        return stringify(param);
      }

      // Remove any optional markers from optional static segments
      return segment.replace(/\?$/g, "");
    })
    // Remove empty segments
    .filter((segment) => !!segment);

  return prefix + segments.join("/");
};

export const generatePath = <Path extends string>(
  originalPath: Path,
  params?: ParamsForRoute<Path>,
): string => {
  try {
    return generatePathRouter(
      originalPath,
      params as {
        [key in PathParam<Path>]: string | null;
      },
    );
  } catch (error) {
    throw new Error(
      `Error while generating path: ${(error as Error)?.message}`,
    );
  }
};
