import type { Attachment } from 'svelte/attachments';
import type { Point, Size } from '~/lib/modules/layout';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  VIEW_PADDING,
  WHEEL_ZOOM_SENSITIVITY,
  ZOOM_STEP,
} from './viewport.constants';
import { clamp, fitDiagramToViewport, zoomAroundPoint } from './viewport.utils';

export class Viewport {
  pan = $state<Point>({ x: 0, y: 0 });
  zoom = $state(1);
  isPanning = $state(false);

  #element: HTMLDivElement | null = null;
  #activePointerId: number | null = null;
  #pointerPosition: Point = { x: 0, y: 0 };

  constructor(private readonly getContentSize: () => Size) {}

  get transform() {
    return `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
  }

  get zoomPercentage() {
    return Math.round(this.zoom * 100);
  }

  get canZoomIn() {
    return this.zoom < MAX_ZOOM;
  }

  get canZoomOut() {
    return this.zoom > MIN_ZOOM;
  }

  panBy(delta: Point) {
    this.pan = {
      x: this.pan.x + delta.x,
      y: this.pan.y + delta.y,
    };
  }

  zoomAt(nextZoom: number, point: Point) {
    const next = zoomAroundPoint(
      { pan: this.pan, zoom: this.zoom },
      clamp(nextZoom, MIN_ZOOM, MAX_ZOOM),
      point,
    );

    this.pan = next.pan;
    this.zoom = next.zoom;
  }

  fit(viewport: Size, content: Size) {
    if (
      viewport.width <= 0 ||
      viewport.height <= 0 ||
      content.width <= 0 ||
      content.height <= 0
    ) {
      return;
    }

    const next = fitDiagramToViewport({
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      diagramWidth: content.width,
      diagramHeight: content.height,
      padding: VIEW_PADDING,
      minimumZoom: MIN_ZOOM,
      maximumZoom: MAX_ZOOM,
    });

    this.pan = next.pan;
    this.zoom = next.zoom;
  }

  zoomIn = () => this.#changeZoom(this.zoom + ZOOM_STEP);

  zoomOut = () => this.#changeZoom(this.zoom - ZOOM_STEP);

  fitView = () => {
    const element = this.#element;
    if (!element) return;

    this.fit(
      { width: element.clientWidth, height: element.clientHeight },
      this.getContentSize(),
    );
  };

  attach: Attachment<HTMLDivElement> = (element) => {
    this.#element = element;

    const controller = new AbortController();
    const listenerOptions = { signal: controller.signal };
    const initialFitFrame = requestAnimationFrame(this.fitView);

    // Wheel handlers must be non-passive to prevent scrolling while zooming.
    element.addEventListener('wheel', this.#onWheel, {
      ...listenerOptions,
      passive: false,
    });
    element.addEventListener('pointerdown', this.#onPointerDown, listenerOptions);
    element.addEventListener('pointermove', this.#onPointerMove, listenerOptions);
    element.addEventListener('pointerup', this.#stopPanning, listenerOptions);
    element.addEventListener('pointercancel', this.#stopPanning, listenerOptions);
    element.addEventListener(
      'lostpointercapture',
      this.#stopPanning,
      listenerOptions,
    );
    element.addEventListener('keydown', this.#onKeyDown, listenerOptions);

    return () => {
      cancelAnimationFrame(initialFitFrame);
      controller.abort();
      this.#releasePointerCapture();
      this.#element = null;
    };
  };

  #changeZoom(nextZoom: number) {
    const element = this.#element;
    if (!element) return;

    this.zoomAt(nextZoom, {
      x: element.clientWidth / 2,
      y: element.clientHeight / 2,
    });
  }

  #onWheel = (event: WheelEvent) => {
    const element = this.#element;
    if (!element) return;

    event.preventDefault();
    const bounds = element.getBoundingClientRect();
    const zoomFactor = Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY);

    this.zoomAt(this.zoom * zoomFactor, {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  #onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || this.#activePointerId !== null) return;

    const target = event.target as Element | null;
    if (target?.closest('[data-diagram-interactive], button')) return;

    this.#activePointerId = event.pointerId;
    this.#pointerPosition = { x: event.clientX, y: event.clientY };
    this.isPanning = true;
    this.#element?.setPointerCapture(event.pointerId);
  };

  #onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== this.#activePointerId) return;

    this.panBy({
      x: event.clientX - this.#pointerPosition.x,
      y: event.clientY - this.#pointerPosition.y,
    });
    this.#pointerPosition = { x: event.clientX, y: event.clientY };
  };

  #releasePointerCapture() {
    const pointerId = this.#activePointerId;
    this.#activePointerId = null;
    this.isPanning = false;

    if (pointerId !== null && this.#element?.hasPointerCapture(pointerId)) {
      this.#element.releasePointerCapture(pointerId);
    }
  }

  #stopPanning = (event: PointerEvent) => {
    if (event.pointerId !== this.#activePointerId) return;

    this.#releasePointerCapture();
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      this.zoomIn();
    } else if (event.key === '-') {
      event.preventDefault();
      this.zoomOut();
    } else if (event.key === '0') {
      event.preventDefault();
      this.fitView();
    }
  };
}
