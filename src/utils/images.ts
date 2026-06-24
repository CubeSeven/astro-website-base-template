/**
 * Builds a srcset string from a base image path.
 *
 * Responsive image variants are OPTIONAL. By default this function
 * returns only the original image as a fallback, avoiding 404s from
 * missing generated variants.
 *
 * To enable responsive images, generate WebP variants at:
 *   /images/responsive/{basename}-{width}w.webp
 * then pass the widths array explicitly:
 *   buildSrcset(src, [480, 768, 1080, 1536])
 *
 * @param src - Image path (e.g. "/images/photo.webp")
 * @param widths - Array of widths for srcset, or false/empty to disable.
 */
export function buildSrcset(
  src: string,
  widths: number[] | false = false,
): string {
  if (!widths || widths.length === 0) {
    // No responsive variants — return only the original as a 1x fallback.
    return `${src.replace(/ /g, '%20')} 1600w`;
  }

  const base = src.replace(/^\/images\//, '').replace(/\.webp$/, '');
  const encodedBase = base.replace(/ /g, '%20');
  const encodedSrc = src.replace(/ /g, '%20');
  const parts: string[] = [];

  for (const w of widths) {
    parts.push(`/images/responsive/${encodedBase}-${w}w.webp ${w}w`);
  }
  parts.push(`${encodedSrc} 1600w`);
  return parts.join(', ');
}

/**
 * Builds a sizes attribute for full-width hero/background images
 */
export const heroSizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1080px) 1080px, 1536px';

/**
 * Builds a sizes attribute for half-width content images
 */
export const halfSizes = '(max-width: 768px) 100vw, 50vw';

/**
 * Builds a sizes attribute for third-width images
 */
export const thirdSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';

/**
 * Builds a sizes attribute for quarter-width images
 */
export const quarterSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
