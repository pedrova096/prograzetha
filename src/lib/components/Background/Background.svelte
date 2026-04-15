<script>
  import dotSvgRaw from './dot.svg?raw';
  const dotSvg = `data:image/svg+xml;base64,${btoa(dotSvgRaw)}`;
</script>

<div
  class="fixed inset-0 -z-50 pointer-events-none bg-linear-to-b from-slate-50 to-slate-200"
>
  <div
    class="bg-repeat size-full"
    style="background-image: url({dotSvg})"
  ></div>
</div>
