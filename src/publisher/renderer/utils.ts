import { gt, gte } from "semver";
import {
  CONCURRENT_MODE_NUMBER,
  CONCURRENT_MODE_SYMBOL_STRING,
  CONTEXT_NUMBER,
  CONTEXT_SYMBOL_STRING,
  DEPRECATED_ASYNC_MODE_SYMBOL_STRING,
  FORWARD_REF_NUMBER,
  FORWARD_REF_SYMBOL_STRING,
  MEMO_NUMBER,
  MEMO_SYMBOL_STRING,
  PROFILER_NUMBER,
  PROFILER_SYMBOL_STRING,
  PROVIDER_NUMBER,
  PROVIDER_SYMBOL_STRING,
  SCOPE_NUMBER,
  SCOPE_SYMBOL_STRING,
  STRICT_MODE_NUMBER,
  STRICT_MODE_SYMBOL_STRING,
} from "../constants.js";

const cachedDisplayNames = new WeakMap();

export function getDisplayName(type, fallbackName = "Anonymous") {
  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  let displayName = fallbackName;

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === "string") {
    displayName = type.displayName;
  } else if (typeof type.name === "string" && type.name !== "") {
    displayName = type.name;
  }

  cachedDisplayNames.set(type, displayName);

  return displayName;
}

export function getEffectDurations(root) {
  // Profiling durations are only available for certain builds.
  // If available, they'll be stored on the HostRoot.
  let effectDuration = null;
  let passiveEffectDuration = null;
  const hostRoot = root.current;
  if (hostRoot != null) {
    const stateNode = hostRoot.stateNode;
    if (stateNode != null) {
      effectDuration =
        stateNode.effectDuration != null ? stateNode.effectDuration : null;
      passiveEffectDuration =
        stateNode.passiveEffectDuration != null
          ? stateNode.passiveEffectDuration
          : null;
    }
  }
  return { effectDuration, passiveEffectDuration };
}

export function utfEncodeString(value: string) {
  const encoded = new Array(value.length);

  for (let i = 0; i < value.length; i++) {
    encoded[i] = value.codePointAt(i);
  }

  return encoded;
}

export function cleanForBridge(data, isPathAllowed, path = []) {
  return;
  // if (data !== null) {
  //   const cleanedPaths = [];
  //   const unserializablePaths = [];
  //   const cleanedData = dehydrate(
  //     data,
  //     cleanedPaths,
  //     unserializablePaths,
  //     path,
  //     isPathAllowed
  //   );
  //
  //   return {
  //     data: cleanedData,
  //     cleaned: cleanedPaths,
  //     unserializable: unserializablePaths
  //   };
  // } else {
  //   return null;
  // }
}

export function getInObject(object, path) {
  return path.reduce((reduced, attr) => {
    if (reduced) {
      if (Object.hasOwnProperty.call(reduced, attr)) {
        return reduced[attr];
      }
      if (typeof reduced[Symbol.iterator] === "function") {
        // Convert iterable to array and return array[index]
        //
        // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.
        return Array.from(reduced)[attr];
      }
    }

    return null;
  }, object);
}

export function getInternalReactConstants(version) {
  const ReactTypeOfSideEffect = {
    DidCapture: 0b10000000,
    NoFlags: 0b00,
    PerformedWork: 0b01,
    Placement: 0b10,
    Incomplete: 0b10000000000000,
  };

  // **********************************************************
  // The section below is copied from files in React repo.
  // Keep it in sync, and add version guards if it changes.
  //
  // Technically these priority levels are invalid for versions before 16.9,
  // but 16.9 is the first version to report priority level to DevTools,
  // so we can avoid checking for earlier versions and support pre-16.9 canary releases in the process.
  let ReactPriorityLevels = {
    ImmediatePriority: 99,
    UserBlockingPriority: 98,
    NormalPriority: 97,
    LowPriority: 96,
    IdlePriority: 95,
    NoPriority: 90,
  };

  if (gt(version, "17.0.2")) {
    ReactPriorityLevels = {
      ImmediatePriority: 1,
      UserBlockingPriority: 2,
      NormalPriority: 3,
      LowPriority: 4,
      IdlePriority: 5,
      NoPriority: 0,
    };
  }

  let ReactTypeOfWork = null;

  // **********************************************************
  // The section below is copied from files in React repo.
  // Keep it in sync, and add version guards if it changes.
  //
  // TODO Update the gt() check below to be gte() whichever the next version number is.
  // Currently the version in Git is 17.0.2 (but that version has not been/may not end up being released).
  if (gt(version, "17.0.1")) {
    ReactTypeOfWork = {
      CacheComponent: 24, // Experimental
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1, // Removed
      CoroutineHandlerPhase: -1, // Removed
      DehydratedSuspenseComponent: 18, // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostText: 6,
      IncompleteClassComponent: 17,
      IndeterminateComponent: 2,
      LazyComponent: 16,
      LegacyHiddenComponent: 23,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: 22, // Experimental
      Profiler: 12,
      ScopeComponent: 21, // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19, // Experimental
      YieldComponent: -1, // Removed
    };
  } else if (gte(version, "17.0.0-alpha")) {
    ReactTypeOfWork = {
      CacheComponent: -1, // Doesn't exist yet
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1, // Removed
      CoroutineHandlerPhase: -1, // Removed
      DehydratedSuspenseComponent: 18, // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostText: 6,
      IncompleteClassComponent: 17,
      IndeterminateComponent: 2,
      LazyComponent: 16,
      LegacyHiddenComponent: 24,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: 23, // Experimental
      Profiler: 12,
      ScopeComponent: 21, // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19, // Experimental
      YieldComponent: -1, // Removed
    };
  } else if (gte(version, "16.6.0-beta.0")) {
    ReactTypeOfWork = {
      CacheComponent: -1, // Doesn't exist yet
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1, // Removed
      CoroutineHandlerPhase: -1, // Removed
      DehydratedSuspenseComponent: 18, // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostText: 6,
      IncompleteClassComponent: 17,
      IndeterminateComponent: 2,
      LazyComponent: 16,
      LegacyHiddenComponent: -1,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: -1, // Experimental
      Profiler: 12,
      ScopeComponent: -1, // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19, // Experimental
      YieldComponent: -1, // Removed
    };
  } else if (gte(version, "16.4.3-alpha")) {
    ReactTypeOfWork = {
      CacheComponent: -1, // Doesn't exist yet
      ClassComponent: 2,
      ContextConsumer: 11,
      ContextProvider: 12,
      CoroutineComponent: -1, // Removed
      CoroutineHandlerPhase: -1, // Removed
      DehydratedSuspenseComponent: -1, // Doesn't exist yet
      ForwardRef: 13,
      Fragment: 9,
      FunctionComponent: 0,
      HostComponent: 7,
      HostPortal: 6,
      HostRoot: 5,
      HostText: 8,
      IncompleteClassComponent: -1, // Doesn't exist yet
      IndeterminateComponent: 4,
      LazyComponent: -1, // Doesn't exist yet
      LegacyHiddenComponent: -1,
      MemoComponent: -1, // Doesn't exist yet
      Mode: 10,
      OffscreenComponent: -1, // Experimental
      Profiler: 15,
      ScopeComponent: -1, // Experimental
      SimpleMemoComponent: -1, // Doesn't exist yet
      SuspenseComponent: 16,
      SuspenseListComponent: -1, // Doesn't exist yet
      YieldComponent: -1, // Removed
    };
  } else {
    ReactTypeOfWork = {
      CacheComponent: -1, // Doesn't exist yet
      ClassComponent: 2,
      ContextConsumer: 12,
      ContextProvider: 13,
      CoroutineComponent: 7,
      CoroutineHandlerPhase: 8,
      DehydratedSuspenseComponent: -1, // Doesn't exist yet
      ForwardRef: 14,
      Fragment: 10,
      FunctionComponent: 1,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostText: 6,
      IncompleteClassComponent: -1, // Doesn't exist yet
      IndeterminateComponent: 0,
      LazyComponent: -1, // Doesn't exist yet
      LegacyHiddenComponent: -1,
      MemoComponent: -1, // Doesn't exist yet
      Mode: 11,
      OffscreenComponent: -1, // Experimental
      Profiler: 15,
      ScopeComponent: -1, // Experimental
      SimpleMemoComponent: -1, // Doesn't exist yet
      SuspenseComponent: 16,
      SuspenseListComponent: -1, // Doesn't exist yet
      YieldComponent: 9,
    };
  }
  // **********************************************************
  // End of copied code.
  // **********************************************************

  function getTypeSymbol(type) {
    const symbolOrNumber =
      typeof type === "object" && type !== null ? type.$$typeof : type;

    // $FlowFixMe Flow doesn't know about typeof "symbol"
    return typeof symbolOrNumber === "symbol"
      ? symbolOrNumber.toString()
      : symbolOrNumber;
  }

  const {
    CacheComponent,
    ClassComponent,
    IncompleteClassComponent,
    FunctionComponent,
    IndeterminateComponent,
    ForwardRef,
    HostRoot,
    HostComponent,
    HostPortal,
    HostText,
    Fragment,
    LazyComponent,
    LegacyHiddenComponent,
    MemoComponent,
    OffscreenComponent,
    Profiler,
    ScopeComponent,
    SimpleMemoComponent,
    SuspenseComponent,
    SuspenseListComponent,
  } = ReactTypeOfWork;

  function resolveFiberType(type) {
    const typeSymbol = getTypeSymbol(type);
    switch (typeSymbol) {
      case MEMO_NUMBER:
      case MEMO_SYMBOL_STRING:
        // recursively resolving memo type in case of memo(forwardRef(Component))
        return resolveFiberType(type.type);
      case FORWARD_REF_NUMBER:
      case FORWARD_REF_SYMBOL_STRING:
        return type.render;
      default:
        return type;
    }
  }

  // NOTICE Keep in sync with shouldFilterFiber() and other get*ForFiber methods
  function getDisplayNameForFiber(fiber) {
    const { elementType, type, tag } = fiber;

    let resolvedType = type;
    if (typeof type === "object" && type !== null) {
      resolvedType = resolveFiberType(type);
    }

    let resolvedContext;

    switch (tag) {
      case CacheComponent:
        return "Cache";
      case ClassComponent:
      case IncompleteClassComponent:
        return getDisplayName(resolvedType);
      case FunctionComponent:
      case IndeterminateComponent:
        return getDisplayName(resolvedType);
      case ForwardRef:
        // Mirror https://github.com/facebook/react/blob/7c21bf72ace77094fd1910cc350a548287ef8350/packages/shared/getComponentName.js#L27-L37
        return (
          (type && type.displayName) ||
          getDisplayName(resolvedType, "Anonymous")
        );
      case HostRoot:
        return null;
      case HostComponent:
        return type;
      case HostPortal:
      case HostText:
      case Fragment:
        return null;
      case LazyComponent:
        // This display name will not be user visible.
        // Once a Lazy component loads its inner component, React replaces the tag and type.
        // This display name will only show up in console logs when DevTools DEBUG mode is on.
        return "Lazy";
      case MemoComponent:
      case SimpleMemoComponent:
        return (
          (elementType && elementType.displayName) ||
          (type && type.displayName) ||
          getDisplayName(resolvedType, "Anonymous")
        );
      case SuspenseComponent:
        return "Suspense";
      case LegacyHiddenComponent:
        return "LegacyHidden";
      case OffscreenComponent:
        return "Offscreen";
      case ScopeComponent:
        return "Scope";
      case SuspenseListComponent:
        return "SuspenseList";
      case Profiler:
        return "Profiler";
      default:
        const typeSymbol = getTypeSymbol(type);

        switch (typeSymbol) {
          case CONCURRENT_MODE_NUMBER:
          case CONCURRENT_MODE_SYMBOL_STRING:
          case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
            return null;
          case PROVIDER_NUMBER:
          case PROVIDER_SYMBOL_STRING:
            // 16.3.0 exposed the context object as "context"
            // PR #12501 changed it to "_context" for 16.3.1+
            // NOTE Keep in sync with inspectElementRaw()
            resolvedContext = fiber.type._context || fiber.type.context;
            return `${resolvedContext.displayName || "Context"}.Provider`;
          case CONTEXT_NUMBER:
          case CONTEXT_SYMBOL_STRING:
            // 16.3-16.5 read from "type" because the Consumer is the actual context object.
            // 16.6+ should read from "type._context" because Consumer can be different (in DEV).
            // NOTE Keep in sync with inspectElementRaw()
            resolvedContext = fiber.type._context || fiber.type;

            // NOTE: TraceUpdatesBackendManager depends on the name ending in '.Consumer'
            // If you change the name, figure out a more resilient way to detect it.
            return `${resolvedContext.displayName || "Context"}.Consumer`;
          case STRICT_MODE_NUMBER:
          case STRICT_MODE_SYMBOL_STRING:
            return null;
          case PROFILER_NUMBER:
          case PROFILER_SYMBOL_STRING:
            return `Profiler(${fiber.memoizedProps.id})`;
          case SCOPE_NUMBER:
          case SCOPE_SYMBOL_STRING:
            return "Scope";
          default:
            // Unknown element type.
            // This may mean a new element type that has not yet been added to DevTools.
            return null;
        }
    }
  }

  return {
    getDisplayNameForFiber,
    getTypeSymbol,
    ReactPriorityLevels,
    ReactTypeOfWork,
    ReactTypeOfSideEffect,
  };
}
