'use client';

import React from 'react';
import Link from 'next/link';
import { HoverSlideText } from '@/components/common/HoverSlideText';

// ── Types ────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface CommonButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  rightIcon?: React.ReactNode;
  /**
   * Renders `rightIcon` as its own full-height circular cap flush against
   * the pill's trailing edge (Figma's "Get Started" CTA) instead of an
   * inline icon — still one single clickable element throughout.
   */
  attachedIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  id?: string;
}

interface ButtonAsButton extends CommonButtonBaseProps {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: never;
  target?: never;
}

interface ButtonAsLink extends CommonButtonBaseProps {
  as: 'link';
  href: string;
  target?: '_blank' | '_self';
  onClick?: never;
  type?: never;
}

interface ButtonAsAnchor extends CommonButtonBaseProps {
  as: 'a';
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  type?: never;
}

type CommonButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

// ── Component ────────────────────────────────────────────────

export const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  block = false,
  iconOnly = false,
  rightIcon,
  attachedIcon = false,
  className = '',
  children,
  ...rest
}) => {
  const isSplit = attachedIcon && !!rightIcon && !iconOnly && !loading;

  const classes = [
    'btn-common',
    `btn-common--${variant}`,
    `btn-common--${size}`,
    loading  ? 'btn-common--loading'   : '',
    disabled ? 'btn-common--disabled'  : '',
    block    ? 'btn-common--block'     : '',
    iconOnly ? 'btn-common--icon-only' : '',
    isSplit  ? 'btn-common--attached'  : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn-spinner" aria-label="Loading" />
      ) : iconOnly ? (
        children
      ) : isSplit ? (
        // Get Started-style CTA (Figma's separate-circle shape) — a
        // single static icon in the circular cap, no hover animation on
        // the icon itself (the cap's background still tints on hover,
        // same as the label).
        <>
          <span className="btn-common__label">{children}</span>
          <span className="btn-common__icon-cap">{rightIcon}</span>
        </>
      ) : (
        // Plain text button (the default, and every button without
        // attachedIcon+rightIcon). Hover feedback is the same "duplicate
        // slides up" effect used on the hero ticker links, via the
        // shared HoverSlideText component.
        <HoverSlideText>{children}</HoverSlideText>
      )}
    </>
  );

  if (rest.as === 'link') {
    const { as: _as, href, target, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} target={target} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  if (rest.as === 'a') {
    const { as: _as, href, target, onClick, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a
        href={href}
        target={target}
        onClick={onClick}
        className={classes}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { as: _as, type = 'button', onClick, ...buttonRest } = rest as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...buttonRest}
    >
      {content}
    </button>
  );
};

export default CommonButton;
