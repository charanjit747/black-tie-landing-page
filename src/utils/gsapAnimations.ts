// ============================================================
// gsapAnimations.ts — Every section's GSAP animation, in one place
//
// Each section owns one exported function here (clearly comment-blocked
// below) and its component just imports that function and calls it from
// a `useEffect` with its own refs — no GSAP timeline/tween logic lives
// inside the section components themselves. Keeps the animation layer
// consistent and easy to find as more sections are added.
// ============================================================

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

// ────────────────────────────────────────────────────────────
// Hero Section
// Masked word-by-word reveal for the two headline lines (via SplitText),
// then the tag/CTA/ticker fade up in sequence behind it.
// ────────────────────────────────────────────────────────────

interface HeroAnimationRefs {
  scope: HTMLElement;
  line1: HTMLElement;
  line2: HTMLElement;
}

export function initHeroAnimation({ scope, line1, line2 }: HeroAnimationRefs): () => void {
  let splitLine1: SplitText | undefined;
  let splitLine2: SplitText | undefined;

  const ctx = gsap.context(() => {
    // Masked word-by-word reveal for the headline — each word rides in
    // its own overflow-hidden mask so it looks like it's wiping up into
    // place rather than just fading, then the rest of the hero follows.
    splitLine1 = SplitText.create(line1, { type: 'words', mask: 'words' });
    splitLine2 = SplitText.create(line2, { type: 'words', mask: 'words' });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.hero__tag',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .from(
        splitLine1.words,
        { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'power4.out' },
        '-=0.25'
      )
      .from(
        splitLine2.words,
        { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'power4.out' },
        '-=0.65'
      )
      .fromTo(
        '.hero__cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.hero__ticker',
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      );
  }, scope);

  return () => {
    ctx.revert();
    splitLine1?.revert();
    splitLine2?.revert();
  };
}

// ────────────────────────────────────────────────────────────
// Header — Mobile Menu
// Background split into 4 strips that extend left→right with a small
// stagger, then the nav links slide in from the left one by one.
// ────────────────────────────────────────────────────────────

interface MobileMenuAnimationRefs {
  overlay: HTMLElement;
  strips: Array<HTMLElement | null>;
  closeButton: HTMLElement | null;
  links: Array<HTMLElement | null>;
}

export function createMobileMenuTimeline({
  overlay,
  strips,
  closeButton,
  links,
}: MobileMenuAnimationRefs): { timeline: gsap.core.Timeline; destroy: () => void } {
  let tl!: gsap.core.Timeline;

  const ctx = gsap.context(() => {
    tl = gsap.timeline({ paused: true })
      .set(overlay, { display: 'flex', autoAlpha: 1 })
      .fromTo(
        strips.filter(Boolean),
        { scaleX: 0, autoAlpha: 0 },
        {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.26,
          stagger: 0.08, // one by one, small gap — not all at once
          ease: 'power2.out',
        },
        'start'
      )
      // Top→bottom version — kept here in case left→right doesn't work
      // out; swap this back in and flip transform-origin in
      // _mobile-menu.scss back to `top center` to restore it.
      // .fromTo(
      //   strips.filter(Boolean),
      //   { scaleY: 0, autoAlpha: 0 },
      //   {
      //     scaleY: 1,
      //     autoAlpha: 1,
      //     duration: 0.26,
      //     stagger: 0.08,
      //     ease: 'power2.out',
      //   },
      //   'start'
      // )
      .fromTo(
        closeButton,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.15 },
        'start+=0.06'
      )
      .fromTo(
        links.filter(Boolean),
        { x: -30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: 'back.out(1)',
        },
        // Later than before — the strips now stagger too (4 × 0.08s
        // apart), so they land later than they used to.
        'start+=0.4'
      )
      .fromTo(
        '.mobile-menu__actions',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );

    tl.eventCallback('onReverseComplete', () => {
      gsap.set(overlay, { display: 'none' });
    });
  }, overlay);

  return { timeline: tl, destroy: () => ctx.revert() };
}

// ────────────────────────────────────────────────────────────
// How It Works? For Investors
// A single "big preview" box that follows the cursor (GSAP quickTo, so
// it trails smoothly instead of snapping to every mousemove event) and
// crossfades in as each row's own small thumbnail fades/scales out —
// the reverse plays on mouse-leave. The row's own text also brightens
// from its resting dim (see _how-it-works.scss) up to full opacity
// while its row is active.
//
// The preview is `position: absolute` against .how-it-works__list (see
// _how-it-works.scss), not `fixed` against the viewport — moveTo() below
// is called with coordinates already relative to that list, not raw
// clientX/clientY. That's what lets the preview scroll away naturally
// with the rest of the list instead of needing any scroll-tracking code
// here to keep it from floating over unrelated sections.
// ────────────────────────────────────────────────────────────

export interface HowItWorksInteraction {
  /** Move the big preview toward a point relative to .how-it-works__list. */
  moveTo: (x: number, y: number) => void;
  /** Reveal the preview + dim this row's own thumbnail/brighten its text. */
  activate: (row: HTMLElement) => void;
  /** Hide the preview + restore this row's thumbnail/text. */
  deactivate: (row: HTMLElement) => void;
  /** Kill any in-flight tweens (call on unmount). */
  destroy: () => void;
}

export function createHowItWorksInteraction(preview: HTMLElement): HowItWorksInteraction {
  // quickTo gives the preview its own eased trail behind the cursor
  // instead of jumping straight to each mousemove coordinate — this is
  // what makes the follow read as smooth rather than jittery.
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });

  // Centered on the cursor point, hidden until the first hover, and
  // given Figma's exact 7.6° tilt (confirmed identical across all 7 row
  // variants) — kept in the same `gsap.set` as the x/y/scale so GSAP
  // manages one composed transform throughout instead of a plain CSS
  // `transform` getting silently overwritten by quickTo.
  gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.85, rotation: 7.6 });

  const moveTo = (x: number, y: number) => {
    xTo(x);
    yTo(y);
  };

  const activate = (row: HTMLElement) => {
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });

    const thumb = row.querySelector<HTMLElement>('.how-it-works__row-thumb');
    const text = row.querySelector<HTMLElement>('.how-it-works__row-text');
    const desc = row.querySelector<HTMLElement>('.how-it-works__row-desc');

    if (thumb) {
      gsap.to(thumb, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: 'power2.out' });
    }
    if (text) {
      gsap.to(text, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
    if (desc) {
      // Animating to the string 'auto' lets GSAP measure the description's
      // real height and tween to it, in normal flow — that's what lets
      // the row's own flex centering re-center the growing title+desc
      // block as it appears. The row itself doesn't actually change size
      // over this because of its own min-height (see _how-it-works.scss),
      // which is what stops that growth from shoving the rows below it.
      gsap.to(desc, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  };

  const deactivate = (row: HTMLElement) => {
    gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.inOut' });

    const thumb = row.querySelector<HTMLElement>('.how-it-works__row-thumb');
    const text = row.querySelector<HTMLElement>('.how-it-works__row-text');
    const desc = row.querySelector<HTMLElement>('.how-it-works__row-desc');

    if (thumb) {
      gsap.to(thumb, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
    }
    if (text) {
      // Clears the inline opacity so the element falls back to its CSS
      // resting value (see _how-it-works.scss) — one source of truth
      // for the dim/idle amount instead of duplicating it here.
      gsap.to(text, { opacity: '', duration: 0.35, ease: 'power2.out' });
    }
    if (desc) {
      gsap.to(desc, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
    }
  };

  const destroy = () => {
    gsap.killTweensOf(preview);
  };

  return { moveTo, activate, deactivate, destroy };
}

// ────────────────────────────────────────────────────────────
// How It Works? For Investors — moving hover stripe
// One shared highlight bar (see .how-it-works__hover-stripe) that glides
// from row to row instead of each row flipping its own background on
// and off — reads as one physical strip sliding up/down the list.
// ────────────────────────────────────────────────────────────

export interface HowItWorksHoverStripe {
  /** Glide the stripe to cover this row (position measured against `list`). */
  moveToRow: (row: HTMLElement, list: HTMLElement) => void;
  /** Fade the stripe out — call on leaving the whole list, not each row. */
  hide: () => void;
  /** Kill any in-flight tweens (call on unmount). */
  destroy: () => void;
}

export function createHowItWorksHoverStripe(stripe: HTMLElement): HowItWorksHoverStripe {
  gsap.set(stripe, { opacity: 0 });

  const moveToRow = (row: HTMLElement, list: HTMLElement) => {
    const rowRect = row.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    gsap.to(stripe, {
      top: rowRect.top - listRect.top,
      height: rowRect.height,
      opacity: 1,
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const hide = () => {
    gsap.to(stripe, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
  };

  const destroy = () => {
    gsap.killTweensOf(stripe);
  };

  return { moveToRow, hide, destroy };
}

// ────────────────────────────────────────────────────────────
// Launch and Scale Real World Asset Tokenized Offerings
// A one-time scroll-triggered reveal: the dark panel slides in from the
// left while the step cards fade/stagger up behind it, playing once as
// the section enters the viewport (ScrollTrigger, not scrubbed).
// ────────────────────────────────────────────────────────────

interface LaunchScaleAnimationRefs {
  section: HTMLElement;
  panel: HTMLElement;
  cards: HTMLElement[];
}

export function initLaunchScaleAnimation({
  section,
  panel,
  cards,
}: LaunchScaleAnimationRefs): () => void {
  const ctx = gsap.context(() => {
    gsap.set(panel, { autoAlpha: 0, x: -40 });
    gsap.set(cards, { autoAlpha: 0, y: 28 });

    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      })
      .to(panel, { autoAlpha: 1, x: 0, duration: 0.7 })
      .to(cards, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.4');
  }, section);

  return () => ctx.revert();
}

// ────────────────────────────────────────────────────────────
// Dashboard Showcase (Dashboard / BTX Markets / Investment Orders /
// Payment Screen)
// GSAP pins the right column (a full-viewport-height wrapper,
// flex-centered — see .dashboard-showcase__media) starting when the
// list reaches the top of the viewport, ending exactly when the LAST
// heading reaches the vertical center of the viewport — tied directly
// to that heading via `endTrigger`/`end: 'center center'` rather than
// an approximated scroll distance, so the section only becomes
// scrollable again once the last slide is genuinely centered against
// the image.
//
// Crossfade: onEnter/onEnterBack (each heading reactivating itself,
// once per line, in either direction) is enough — the very next
// heading's own onEnter already covers "the next one arriving", so
// mirroring that with onLeave/onLeaveBack on THIS heading would
// double-fire the crossfade at two different scroll positions.
//
// The start/end lines deliberately use DIFFERENT edges of the heading,
// not the same one twice — that's what makes the two directions feel
// identical instead of the "top" edge case, where a short heading is
// already fully visible well before its top reaches the 20% line
// (a ~20%-of-viewport lag), while going down a heading's top reaching
// 80% roughly coincides with it just becoming fully visible (near-zero
// lag). Using the BOTTOM edge for the top exit line mirrors that same
// near-zero lag: start 'top 80%' (top edge crossing the bottom 20%) for
// entering from below, end 'bottom 20%' (bottom edge crossing the top
// 20%) for entering from above.
// Desktop-only — wrapped in gsap.matchMedia() (the current,
// non-deprecated API — ScrollTrigger.matchMedia() still exists but
// GSAP's own docs mark it deprecated in favor of this) so it's fully
// created/torn down exactly at the $bp-desktop-sm breakpoint, including
// on a live resize across it, rather than a one-time check at mount.
// ────────────────────────────────────────────────────────────

interface DashboardShowcaseRefs {
  list: HTMLElement;
  media: HTMLElement;
  headings: HTMLElement[];
  images: HTMLElement[];
}

// Must stay in sync with $bp-desktop-sm in _variables.scss.
const DASHBOARD_SHOWCASE_BREAKPOINT = 1280;

export function initDashboardShowcaseAnimation({
  list,
  media,
  headings,
  images,
}: DashboardShowcaseRefs): () => void {
  const mm = gsap.matchMedia();

  mm.add(`(min-width: ${DASHBOARD_SHOWCASE_BREAKPOINT}px)`, () => {
    gsap.set(images, { autoAlpha: 0 });
    gsap.set(images[0], { autoAlpha: 1 });

    const crossfadeTo = (index: number) => {
      images.forEach((img, i) => {
        gsap.to(img, { autoAlpha: i === index ? 1 : 0, duration: 0.5, ease: 'power2.out' });
      });
    };

    const pinTrigger = ScrollTrigger.create({
      trigger: list,
      start: 'top top',
      endTrigger: headings[headings.length - 1],
      end: 'center center',
      pin: media,
      pinSpacing: false,
    });

    const headingTriggers = headings.map((heading, index) =>
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%', // scrolling down: fires once the heading's top reaches the bottom 20% of the viewport
        end: 'bottom 20%', // scrolling up: fires once the heading's bottom reaches the top 20% of the viewport
        onEnter: () => crossfadeTo(index),
        onEnterBack: () => crossfadeTo(index),
      })
    );

    // matchMedia's own cleanup — runs when this query stops matching
    // (including a live resize past the breakpoint), not just on
    // unmount.
    return () => {
      pinTrigger.kill();
      headingTriggers.forEach((trigger) => trigger.kill());
    };
  });

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Stats (trust bar: Asset Offerings / Target Asset Value / KYC-KYB
// Verified Participation / Supported Asset Classes)
// Each number counts up from 0 to its real value once the card scrolls
// into view, then never repeats — `once: true` so re-scrolling past it
// doesn't re-trigger the count. Runs at every breakpoint (no
// gsap.matchMedia gate) since it isn't a hover/cursor interaction.
// Writes straight to the DOM node's textContent via a plain tween proxy
// object rather than piping the value through React state on every
// tick — a 60fps count-up has no business re-rendering a component.
// ────────────────────────────────────────────────────────────

interface StatsCounterItem {
  el: HTMLElement;
  value: number;
  format: (n: number) => string;
}

interface StatsCounterRefs {
  section: HTMLElement;
  items: StatsCounterItem[];
}

export function initStatsCounterAnimation({ section, items }: StatsCounterRefs): () => void {
  const proxies = items.map(() => ({ value: 0 }));

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      items.forEach((item, i) => {
        gsap.to(proxies[i], {
          value: item.value,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            item.el.textContent = item.format(proxies[i].value);
          },
        });
      });
    },
  });

  return () => trigger.kill();
}

// ────────────────────────────────────────────────────────────
// Partners marquee (Our Partners logo strip)
// The track's DOM already holds the logo list twice back to back (see
// Partners.tsx) — animating xPercent from 0 to -50 on an infinite
// repeat lands exactly on the start of the second (pixel-identical)
// copy, so the loop point is invisible: no jump, no flicker, no reset.
// xPercent is relative to the track's own rendered width rather than a
// fixed pixel distance, so it stays correct at every breakpoint without
// any resize handling. `ease: 'none'` keeps the speed constant instead
// of easing in/out on every repeat, which is what a looping marquee
// needs — an eased loop visibly lurches at each repeat boundary.
// ────────────────────────────────────────────────────────────

const PARTNERS_MARQUEE_SPEED_PX_PER_SEC = 60;

export function initPartnersMarqueeAnimation(track: HTMLElement): () => void {
  // Duration derived from the track's actual width (half of it, since
  // the track holds two copies) so the on-screen speed is constant
  // regardless of how many logos there are or how wide the viewport is.
  const duration = track.scrollWidth / 2 / PARTNERS_MARQUEE_SPEED_PX_PER_SEC;

  const tween = gsap.to(track, {
    xPercent: -50,
    duration,
    ease: 'none',
    repeat: -1,
  });

  return () => tween.kill();
}
