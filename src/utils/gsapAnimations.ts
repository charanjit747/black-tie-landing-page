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

// A one-time scroll-triggered reveal (ScrollTrigger's default
// toggleActions, or an explicit `once: true`) fires immediately at
// creation if the trigger's `start` condition is already satisfied —
// which happens whenever the page mounts already scrolled past it
// (a reload mid-page, a back/forward restore, a deep link). That reads
// as the animation firing "for no reason" on load instead of in
// response to an actual scroll. Callers check this BEFORE creating
// their ScrollTrigger and, if already past the threshold, jump straight
// to the settled end-state with gsap.set() instead.
function isAboveEntranceThreshold(el: HTMLElement, viewportFraction: number): boolean {
  if (typeof window === 'undefined') return false;
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * viewportFraction;
}

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

  // Desktop-only, same 1280px threshold as every other animation in
  // this file (see initDashboardShowcaseAnimation's own note) — no
  // SplitText/timeline/tween is created at all below it, and nothing
  // else here relies on GSAP to become visible in the first place
  // (.hero__tag/__cta/__ticker have no CSS opacity:0 of their own), so
  // skipping this entirely still leaves the hero fully visible, just
  // without the entrance motion.
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1280px)', () => {
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

    return () => {
      splitLine1?.revert();
      splitLine2?.revert();
    };
  }, scope); // scope arg: `.hero__tag` etc. resolve within this element only

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Header — Mobile Menu
// No longer GSAP — the open/close reveal (background strips, close
// button, nav links, actions) is now plain CSS transitions driven by a
// single class toggle. See MobileMenu.tsx and _mobile-menu.scss.
// ────────────────────────────────────────────────────────────

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
  /**
   * Reveal the shared floating preview itself. Called only on entering
   * the *list* as a whole (see HowItWorks.tsx), never per-row — see the
   * note above showPreview/hidePreview below for why.
   */
  showPreview: () => void;
  /** Hide the shared floating preview itself — only on leaving the list. */
  hidePreview: () => void;
  /** Dim this row's own thumbnail/brighten its text/reveal its description. */
  activateRow: (row: HTMLElement) => void;
  /** Restore this row's own thumbnail/text/description. */
  deactivateRow: (row: HTMLElement) => void;
  /** Kill any in-flight tweens (call on unmount). */
  destroy: () => void;
}

export function createHowItWorksInteraction(preview: HTMLElement): HowItWorksInteraction {
  // quickTo gives the preview its own eased trail behind the cursor
  // instead of jumping straight to each mousemove coordinate — this is
  // what makes the follow read as smooth rather than jittery.
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });

  // Centered on the cursor point, hidden until the first hover. No
  // rotation here — each row's popout image (see STEPS.preview in
  // HowItWorks.tsx) is now Figma's own pre-composed export, tilt and
  // shadow already baked into the pixels, so rotating this container on
  // top would double the tilt.
  gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.85 });

  const moveTo = (x: number, y: number) => {
    xTo(x);
    yTo(y);
  };

  // showPreview/hidePreview own the shared preview's autoAlpha/scale —
  // and ONLY these two functions do. They used to be folded into
  // activate/deactivate (fired once per row on every mouseenter/
  // mouseleave), which meant switching from one row straight to an
  // adjacent one fired a hide *and* a show on the very same element
  // back to back. Fast, continuous hovering across several rows queued
  // up many of these alternating tweens on the same autoAlpha/scale
  // properties in quick succession, and depending on exactly which pair
  // of calls landed last, the preview could settle stuck at full
  // opacity with no further row/mouse event left to correct it — the
  // reported "gets stuck" bug reproduced with no scrolling involved at
  // all. Splitting it so the preview's own visibility responds only to
  // entering/leaving the *list* (a single, simple on/off — see
  // HowItWorks.tsx's handleMouseEnter/handleListMouseLeave) removes that
  // race entirely: switching rows now only ever touches each row's own
  // thumb/text/desc (activateRow/deactivateRow below), never re-fires a
  // competing tween on the shared preview itself.
  const showPreview = () => {
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
  };

  const hidePreview = () => {
    gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.inOut' });
  };

  const activateRow = (row: HTMLElement) => {
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

  const deactivateRow = (row: HTMLElement) => {
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

  return { moveTo, showPreview, hidePreview, activateRow, deactivateRow, destroy };
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
  // Desktop-only, same 1280px threshold as every other animation in
  // this file — no gsap.set/timeline/ScrollTrigger at all below it.
  const mm = gsap.matchMedia();

  mm.add(
    '(min-width: 1280px)',
    () => {
      if (isAboveEntranceThreshold(section, 0.75)) {
        gsap.set(panel, { autoAlpha: 1, x: 0 });
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

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
    },
    section
  );

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Dashboard Showcase (Dashboard / BTX Markets / Investment Orders /
// Payment Screen)
// No sticky/pinned column and no crossfade between stacked images —
// the section just scrolls normally, same two-column design as before
// (heading left, its own screenshot right, one row per step). Each
// card instead plays its own one-time 3D tilt as it scrolls into view —
// same entrance technique used by
// https://agntix-next.vercel.app/creative-agency's "OUR RECENT
// PROJECTS" thumbnails (confirmed directly against that site's own
// computed styles), tuned to this section's own needs rather than
// copied 1:1 (see the two notes below).
//
// The animated element is the WHOLE card — the gradient border frame
// (.dashboard-showcase__item-image-card in _dashboard-showcase.scss),
// not just the cropped image inside it — so the frame tilts along with
// the screenshot as one rigid piece rather than staying static while
// the image moves inside it.
//
// Both rotation and z return to EXACTLY their identity values (0, 0) —
// not the reference site's own permanent slight resting tilt/offset —
// once the card's own center reaches the viewport's center: full size,
// no tilt, reading exactly like a normal image at rest, same as before
// any of this tilt work started. A residual z left over at rest (an
// earlier iteration of this same feature) permanently shrank the card
// by roughly 15% once paired with the much closer, more dramatic 80px
// perspective now in use (see .dashboard-showcase__item-image) — scale
// = perspective / (perspective + |z|) — leaving a visible gap on the
// right of its column instead of filling it like it used to. z still
// genuinely DIPS well before recovering (keyframed, not a straight
// line from 0 to 0) — with no z motion at all, rotation alone just
// reads as a flat card flipping in place, not real 3D depth easing
// into the page. `end: 'center center'` ties "settled" to the card's
// own center crossing the viewport's center, rather than an arbitrary
// scroll distance. `scrub: 1` ties it to scroll position with a touch
// of smoothing rather than a fixed duration, so it eases in with the
// scroll itself and naturally reverses if the user scrolls back up.
//
// Perspective lives on each card's own wrapper
// (.dashboard-showcase__item-image, one per grid cell) rather than a
// `transformPerspective` baked into the card's own transform — it has
// to live on an ANCESTOR of the rotated element to read as real depth,
// and a per-card wrapper keeps each card's own vanishing point centered
// on itself rather than shared across the whole grid. `overflow: hidden`
// and the image inset (via padding, see _dashboard-showcase.scss) both
// live on the card itself too, not a separate static child — a nested
// clip context can compute inconsistently with an ancestor's own 3D
// transform in some browsers' rendering paths, which is what was
// causing the gradient-border reveal to look lopsided (wider on one
// side) before this was consolidated onto one element.
// ────────────────────────────────────────────────────────────

interface DashboardShowcaseRefs {
  cards: HTMLElement[];
}

export function initDashboardShowcaseAnimation({ cards }: DashboardShowcaseRefs): () => void {
  // Desktop-only, same threshold as the CSS side's $bp-desktop-sm
  // (1280px, see _dashboard-showcase.scss) — below it the section goes
  // back to its plain pre-animation 2-column layout with flat images,
  // per request, rather than the tilt just looking cramped at a narrower
  // width. gsap.matchMedia (not a one-off window.matchMedia check, see
  // the same pattern in HowItWorks.tsx) creates the tweens only while
  // the query matches and automatically reverts them if the viewport is
  // resized back below it.
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1280px)', () => {
    cards.forEach((card) => {
      // Values, trigger points, scrub, and immediateRender all pulled
      // directly from the reference site's own production JS bundle
      // (fetched and read verbatim, not inferred from computed styles)
      // — its equivalent call is:
      //   gsap.set(".studio-project-thumb", { perspective: 60 });
      //   gsap.fromTo(".studio-project-thumb img",
      //     { rotationX: 1.8, z: "0vh" },
      //     { rotationX: -0.5, z: "-2vh", scrollTrigger: {
      //         trigger: e, start: "top+=150px bottom", end: "bottom top",
      //         immediateRender: false, scrub: 0.1 } });
      // Two things earlier attempts at this got wrong: `end` is
      // "bottom top", not "center center" — the tween runs for the
      // card's entire time in the viewport, not just until it reaches
      // center, so cutting it off at center left it barely underway.
      // And the settle is a real, PERMANENT residual (-0.5deg/-2vh) —
      // it never returns to flat/full-size; every earlier "should be
      // flat at center" version was a deviation from how this actually
      // works, not a fix.
      gsap.fromTo(
        card,
        { rotationX: 1.8, z: '0vh' },
        {
          rotationX: -0.5,
          z: '-2vh',
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: 'top+=150px bottom',
            end: 'bottom top',
            scrub: 0.1,
          },
        }
      );
    });
  });

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Stats (trust bar: Asset Offerings / Target Asset Value / KYC-KYB
// Verified Participation / Supported Asset Classes)
// Each number counts up from 0 to its real value once the card scrolls
// into view, then never repeats — `once: true` so re-scrolling past it
// doesn't re-trigger the count. Desktop-only (1280px), like every other
// animation in this file — below it the final value is just set
// directly, no GSAP/ScrollTrigger involved at all. Writes straight to
// the DOM node's textContent via a plain tween proxy object rather than
// piping the value through React state on every tick — a 60fps
// count-up has no business re-rendering a component.
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
  // Desktop-only, same 1280px threshold as every other animation in
  // this file — below it, jump straight to each stat's final value via
  // plain textContent (no GSAP/ScrollTrigger call at all). The JSX
  // renders `stat.format(0)` initially either way, so this is what
  // actually shows the real number in both cases — it just isn't
  // *counted up* to below 1280px, a plain window.matchMedia check
  // (not gsap.matchMedia — this path must not touch the GSAP API) is
  // enough since there's no need to react to a later resize here: the
  // final value is already correct regardless of width.
  const isDesktop =
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches;

  if (!isDesktop || isAboveEntranceThreshold(section, 0.8)) {
    items.forEach((item) => {
      item.el.textContent = item.format(item.value);
    });
    return () => {};
  }

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
  // Desktop-only, same 1280px threshold as every other animation in
  // this file — below it the track just sits still (first copy of the
  // logo list visible, same as any other static row), no gsap.to at all.
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1280px)', () => {
    // Duration derived from the track's actual width (half of it, since
    // the track holds two copies) so the on-screen speed is constant
    // regardless of how many logos there are or how wide the viewport is.
    const duration = track.scrollWidth / 2 / PARTNERS_MARQUEE_SPEED_PX_PER_SEC;

    gsap.to(track, {
      xPercent: -50,
      duration,
      ease: 'none',
      repeat: -1,
    });
  });

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Shared fade-up-in-sequence reveal, used by the several simpler
// sections below (What We Do, Security, Ecosystem's title, FAQ, Join
// Our Community, Contact Us) — each just fades/slides its own content
// up once, in the order its groups are listed, rather than needing its
// own bespoke timeline. A "group" is either one element or an array of
// elements to stagger together (e.g. a row of cards).
//
// Guarded by isAboveEntranceThreshold the same way LaunchScale/Stats
// are above: skips straight to the settled end-state instead of
// replaying the entrance if the section is already in view when this
// mounts (a mid-page reload, a deep link, a back/forward restore).
// ────────────────────────────────────────────────────────────

type RevealGroup = HTMLElement | Array<HTMLElement | null> | null;

function createFadeUpReveal(
  section: HTMLElement,
  groups: RevealGroup[],
  opts: { start?: string; y?: number } = {}
): () => void {
  const start = opts.start ?? 'top 75%';
  const y = opts.y ?? 28;

  const normalized = groups
    .map((g) => (Array.isArray(g) ? g.filter((el): el is HTMLElement => !!el) : g ? [g] : []))
    .filter((g) => g.length > 0);

  // Desktop-only, same 1280px threshold as every other animation in
  // this file — below it none of these sections get any gsap.set/
  // timeline/ScrollTrigger call at all, and none of them rely on GSAP
  // to become visible in the first place (no CSS opacity:0 default), so
  // skipping this entirely still leaves each section fully visible,
  // just without the scroll-in motion.
  const mm = gsap.matchMedia();

  mm.add(
    '(min-width: 1280px)',
    () => {
      const allEls = normalized.flat();
      if (allEls.length === 0) return;

      if (isAboveEntranceThreshold(section, 0.75)) {
        gsap.set(allEls, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(allEls, { autoAlpha: 0, y });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.7 },
        scrollTrigger: { trigger: section, start },
      });

      normalized.forEach((group, i) => {
        tl.to(
          group,
          { autoAlpha: 1, y: 0, stagger: group.length > 1 ? 0.12 : 0 },
          i === 0 ? undefined : '-=0.35'
        );
      });
    },
    section
  );

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// What We Do (Bringing Real-World Assets On-Chain)
// Tag+heading fade up, then the three feature rows stagger up behind
// them, then the CTA and the looping globe video settle in together.
// ────────────────────────────────────────────────────────────

interface WhatWeDoAnimationRefs {
  section: HTMLElement;
  intro: HTMLElement | null;
  features: Array<HTMLElement | null>;
  cta: HTMLElement | null;
  visual: HTMLElement | null;
}

export function initWhatWeDoAnimation({
  section,
  intro,
  features,
  cta,
  visual,
}: WhatWeDoAnimationRefs): () => void {
  return createFadeUpReveal(section, [intro, features, [cta, visual].filter(Boolean) as HTMLElement[]]);
}

// ────────────────────────────────────────────────────────────
// Security and Compliance at Institutional Standards
// Heading fades up, then the three compliance cards (Sumsub/Hashlock/
// DocuSign) stagger up behind it.
// ────────────────────────────────────────────────────────────

interface SecurityAnimationRefs {
  section: HTMLElement;
  heading: HTMLElement | null;
  cards: Array<HTMLElement | null>;
}

export function initSecurityAnimation({ section, heading, cards }: SecurityAnimationRefs): () => void {
  return createFadeUpReveal(section, [heading, cards]);
}

// ────────────────────────────────────────────────────────────
// Ecosystem title row (Black Tie Real-World Asset Infrastructure
// Ecosystem) — just the heading/CTA row above the slider; the slider
// itself already has its own continuous motion (autoplay) and isn't
// touched here.
// ────────────────────────────────────────────────────────────

interface EcosystemTitleAnimationRefs {
  section: HTMLElement;
  heading: HTMLElement | null;
  cta: HTMLElement | null;
}

export function initEcosystemTitleAnimation({
  section,
  heading,
  cta,
}: EcosystemTitleAnimationRefs): () => void {
  return createFadeUpReveal(section, [heading, cta]);
}

// ────────────────────────────────────────────────────────────
// FAQ (Frequently Asked Questions?)
// Tag+heading fade up, then the FAQ items themselves stagger up behind
// them (the accordion open/close motion is separate — plain CSS, see
// _faq.scss — this only covers the one-time scroll-in reveal).
// ────────────────────────────────────────────────────────────

interface FAQAnimationRefs {
  section: HTMLElement;
  header: HTMLElement | null;
  items: Array<HTMLElement | null>;
}

export function initFAQAnimation({ section, header, items }: FAQAnimationRefs): () => void {
  return createFadeUpReveal(section, [header, items]);
}

// ────────────────────────────────────────────────────────────
// Join Our Community (newsletter signup)
// "Join Our Community" fades up first, then the "Where Real Assets
// Meet Digital Markets" tagline + description settle in behind it,
// then the email/subscribe form.
// ────────────────────────────────────────────────────────────

interface JoinCommunityAnimationRefs {
  section: HTMLElement;
  heading: HTMLElement | null;
  subhead: HTMLElement | null;
  form: HTMLElement | null;
}

export function initJoinCommunityAnimation({
  section,
  heading,
  subhead,
  form,
}: JoinCommunityAnimationRefs): () => void {
  return createFadeUpReveal(section, [heading, subhead, form]);
}

// ────────────────────────────────────────────────────────────
// Contact Us ("Reach out via the contact form...")
// Heading fades up first, then the two columns — the globe
// illustration and the form — settle in together right behind it.
// ────────────────────────────────────────────────────────────

interface ContactUsAnimationRefs {
  section: HTMLElement;
  heading: HTMLElement | null;
  globe: HTMLElement | null;
  form: HTMLElement | null;
}

export function initContactUsAnimation({
  section,
  heading,
  globe,
  form,
}: ContactUsAnimationRefs): () => void {
  return createFadeUpReveal(section, [heading, [globe, form].filter(Boolean) as HTMLElement[]]);
}

// ────────────────────────────────────────────────────────────
// Custom Cursor — premium ring + dot that trails the pointer, fading
// out over clickable elements so the native pointer cursor shows
// through instead (see .custom-cursor / body cursor rules in
// _custom-cursor.scss).
//
// Gated the same way as every other effect in this file — desktop-only,
// min-width: 1280px — plus (hover: hover) and (pointer: fine) so a
// touch device never gets a cursor it can't see. Below that combined
// query, this makes zero gsap.* calls and adds zero listeners, same
// "no GSAP below 1280px" rule the rest of the site follows.
// ────────────────────────────────────────────────────────────

const CURSOR_CLICKABLE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], .btn-common';

export function initCustomCursorAnimation(ring: HTMLElement, dot: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1280px) and (hover: hover) and (pointer: fine)', () => {
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    // The ring trails with a soft lag; the dot follows almost instantly
    // right on top of the real pointer position — the combination is
    // what reads as a deliberate, premium cursor rather than a plain
    // 1:1 swap-in replacement.
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    let isVisible = false;
    let isOverClickable = false;

    const handleMove = (e: MouseEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);

      // First movement reveals the cursor — avoids a flash at (0, 0)
      // before any real coordinate has arrived.
      if (!isVisible) {
        isVisible = true;
        gsap.to(dot, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
        if (!isOverClickable) {
          gsap.to(ring, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
        }
      }
    };

    // Delegated on the document root instead of per-element listeners —
    // this project's DOM adds/removes plenty of nodes on scroll/hover
    // interactions elsewhere, and a delegated pair here needs no
    // re-binding when that happens.
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(CURSOR_CLICKABLE_SELECTOR)) {
        isOverClickable = true;
        gsap.to(ring, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(CURSOR_CLICKABLE_SELECTOR)) {
        isOverClickable = false;
        if (isVisible) {
          gsap.to(ring, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
        }
      }
    };

    // Hide entirely when the pointer leaves the viewport (e.g. off the
    // top into the browser chrome) so a stray ring/dot never gets left
    // sitting at the last known edge position.
    const handleLeaveWindow = () => {
      isVisible = false;
      gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow);
    };
  });

  return () => mm.revert();
}

// ────────────────────────────────────────────────────────────
// Shared decorative background lines (SectionBackgroundLines) — each
// of the 7 vertical dividers grows top-to-bottom, left to right, as
// the section they belong to scrolls into view. Desktop-only, same
// min-width: 1280px gate as everything else in this file — below it,
// the lines are just permanently visible via plain CSS (see
// _background-lines.scss), no gsap.* calls at all.
// ────────────────────────────────────────────────────────────

export function initSectionBackgroundLinesAnimation(lines: HTMLElement[]): () => void {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1280px)', () => {
    const wrapper = lines[0].parentElement;
    if (!wrapper) return;

    gsap.set(lines, { scaleY: 0 });

    // GSAP's *own* stagger + scrub, not a hand-rolled scroll→progress
    // mapping — a genuine scrub tween is continuously re-synced to the
    // current scroll position on every ScrollTrigger refresh (including
    // right when this is created), so there's no "already in view on
    // mount" case to special-case here the way a one-shot entrance
    // animation needs; it just starts wherever the scroll position
    // already puts it. `scrub: 1` gives the playhead its own inertia —
    // it eases toward the scroll-derived target over ~1s instead of
    // snapping to the raw scroll value every frame, which is what
    // actually makes this read as smooth. `stagger` + `duration`
    // together define ONE combined virtual timeline that scrub then
    // maps across the whole start→end scroll range: each line spans
    // duration / (duration + stagger*(count-1)) of that range, and
    // consecutive lines overlap by (duration - stagger) of that same
    // span — duration well over 2x the stagger here is what keeps a
    // line still visibly growing when the next one starts, instead of
    // a dead gap between them.
    const tween = gsap.to(lines, {
      scaleY: 1,
      ease: 'none', // scrub already maps progress 1:1 to scroll — an eased curve would fight that
      duration: 1,
      stagger: 0.3,
      scrollTrigger: {
        trigger: wrapper,
        // A moderate, fixed viewport-relative window centered on the
        // middle of the screen — NOT 'top bottom' → 'top top' (the
        // section's entire transit across the full page height), which
        // made the first couple of lines finish while the section's
        // top was still far below center. 80%→20% is symmetric around
        // 'top 50%' (dead center), and stays a sane ~60% of one
        // viewport-height regardless of how tall the section itself is.
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    return () => tween.scrollTrigger?.kill();
  });

  return () => mm.revert();
}
