export function prefersReducedMotion(mediaQueryList) {
  return Boolean(mediaQueryList?.matches);
}

export function canUseViewTransition(documentRef, mediaQueryList) {
  return !prefersReducedMotion(mediaQueryList)
    && typeof documentRef?.startViewTransition === "function";
}

export function runViewTransition(documentRef, mediaQueryList, update) {
  if (!canUseViewTransition(documentRef, mediaQueryList)) return Promise.resolve(update());
  const transition = documentRef.startViewTransition(update);
  return transition.finished.catch(() => undefined);
}

export function createContentTransition({ prefersReducedMotion: isReduced, wait, nextFrame }) {
  let latestRequest = 0;

  return async (element, update) => {
    const request = ++latestRequest;
    if (isReduced()) {
      delete element.dataset.motionState;
      return update();
    }

    element.dataset.motionState = "leaving";
    await wait(120);
    if (request !== latestRequest) return;

    update();
    nextFrame(() => {
      if (request === latestRequest) element.dataset.motionState = "entering";
    });
  };
}
