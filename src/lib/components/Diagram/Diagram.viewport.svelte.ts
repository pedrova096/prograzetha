import type { Point } from '~/lib/modules/layout';
import type { Attachment } from 'svelte/attachments';
import {
  DIAGRAM_VIEW_PADDING,
  DIAGRAM_ZOOM_STEP,
  MAX_DIAGRAM_ZOOM,
  MIN_DIAGRAM_ZOOM,
} from './Diagram.constants';
import {
  clamp,
  fitDiagramToViewport,
  zoomAroundPoint,
} from './Diagram.utils';

type DiagramSize = {
  width: number;
  height: number;
};

export class DiagramViewportController {
  pan = $state<Point>({ x: 0, y: 0 });
  zoom = $state(1);
  isPanning = $state(false);

  #element: HTMLDivElement | null = null;
  #activePointerId: number | null = null;
  #pointerOrigin: Point = { x: 0, y: 0 };
  #panOrigin: Point = { x: 0, y: 0 };

  constructor(private readonly getDiagramSize: () => DiagramSize) {}

  get transform() {
    return `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
  }

  get zoomPercentage() {
    return Math.round(this.zoom * 100);
  }

  get canZoomIn() {
    return this.zoom < MAX_DIAGRAM_ZOOM;
  }

  get canZoomOut() {
    return this.zoom > MIN_DIAGRAM_ZOOM;
  }

  zoomIn = () => {
    this.changeZoom(this.zoom + DIAGRAM_ZOOM_STEP);
  };

  zoomOut = () => {
    this.changeZoom(this.zoom - DIAGRAM_ZOOM_STEP);
  };

  fitView = () => {
    const element = this.#element;
    const diagram = this.getDiagramSize();

    if (!element || !diagram.width || !diagram.height) return;

    const fitted = fitDiagramToViewport({
      viewportWidth: element.clientWidth,
      viewportHeight: element.clientHeight,
      diagramWidth: diagram.width,
      diagramHeight: diagram.height,
      padding: DIAGRAM_VIEW_PADDING,
      minimumZoom: MIN_DIAGRAM_ZOOM,
      maximumZoom: MAX_DIAGRAM_ZOOM,
    });

    this.pan = fitted.pan;
    this.zoom = fitted.zoom;
  };

  attach: Attachment<HTMLDivElement> = (element) => {
    this.#element = element;

    const controller = new AbortController();
    const listenerOptions = { signal: controller.signal };
    const initialFitFrame = requestAnimationFrame(this.fitView);

    element.addEventListener('wheel', this.#onWheel, {
      ...listenerOptions,
      passive: false,
    });
    element.addEventListener(
      'pointerdown',
      this.#onPointerDown,
      listenerOptions,
    );
    element.addEventListener(
      'pointermove',
      this.#onPointerMove,
      listenerOptions,
    );
    element.addEventListener('pointerup', this.#stopPanning, listenerOptions);
    element.addEventListener(
      'pointercancel',
      this.#stopPanning,
      listenerOptions,
    );
    element.addEventListener('keydown', this.#onKeyDown, listenerOptions);

    return () => {
      cancelAnimationFrame(initialFitFrame);
      controller.abort();

      if (this.#element === element) {
        this.#element = null;
        this.#activePointerId = null;
        this.isPanning = false;
      }
    };
  };

  changeZoom = (nextZoom: number, point?: Point) => {
    const element = this.#element;
    if (!element) return;

    const boundedZoom = clamp(
      nextZoom,
      MIN_DIAGRAM_ZOOM,
      MAX_DIAGRAM_ZOOM,
    );
    const zoomPoint = point ?? {
      x: element.clientWidth / 2,
      y: element.clientHeight / 2,
    };
    const nextViewport = zoomAroundPoint(
      { pan: this.pan, zoom: this.zoom },
      boundedZoom,
      zoomPoint,
    );

    this.pan = nextViewport.pan;
    this.zoom = nextViewport.zoom;
  };

  #onWheel = (event: WheelEvent) => {
    const element = this.#element;
    if (!element) return;

    event.preventDefault();
    const bounds = element.getBoundingClientRect();
    const zoomPoint = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const zoomFactor = Math.exp(-event.deltaY * 0.0015);

    this.changeZoom(this.zoom * zoomFactor, zoomPoint);
  };

  #onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;

    const target = event.target as Element | null;
    if (target?.closest('[data-diagram-interactive], button')) return;

    this.#activePointerId = event.pointerId;
    this.#pointerOrigin = { x: event.clientX, y: event.clientY };
    this.#panOrigin = this.pan;
    this.isPanning = true;
    this.#element?.setPointerCapture(event.pointerId);
  };

  #onPointerMove = (event: PointerEvent) => {
    if (!this.isPanning || event.pointerId !== this.#activePointerId) return;

    this.pan = {
      x: this.#panOrigin.x + event.clientX - this.#pointerOrigin.x,
      y: this.#panOrigin.y + event.clientY - this.#pointerOrigin.y,
    };
  };

  #stopPanning = (event: PointerEvent) => {
    if (event.pointerId !== this.#activePointerId) return;

    this.isPanning = false;
    this.#activePointerId = null;
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
