import { Link } from "react-router-dom";
import { clsx } from "clsx";

export function Container({ className = "", children }) {
  return <div className={clsx("mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={clsx("ui-section-heading max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="ui-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="ui-section-title font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="ui-section-description mt-4 text-base leading-7 text-slate-300">{description}</p> : null}
    </div>
  );
}

export function Button({ as = "button", href, to, variant = "primary", className = "", ...props }) {
  const classes = clsx(
    "ui-button inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
    `ui-button-${variant}`,
    variant === "primary" &&
      "bg-gradient-to-r from-electric-500 to-electric-400 text-white shadow-glow hover:brightness-110",
    variant === "secondary" &&
      "border border-black/10 bg-white text-gray-900 hover:border-electric-400/50 hover:bg-electric-50/50",
    variant === "ghost" && "text-electric-500 hover:text-electric-600",
    className
  );

  if (to) {
    return <Link to={to} className={classes} {...props} />;
  }

  if (href) {
    return <a href={href} className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="ui-field block text-sm text-slate-200">
      <span className="ui-label mb-1.5 block font-medium">{label}</span>
      <input
        className={clsx(
          "ui-control w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15",
          className
        )}
        {...props}
      />
      {error ? <span className="ui-error mt-1.5 block text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="ui-field block text-sm text-slate-200">
      <span className="ui-label mb-1.5 block font-medium">{label}</span>
      <select
        className={clsx(
          "ui-control w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="ui-error mt-1.5 block text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function TextArea({ label, error, className = "", ...props }) {
  return (
    <label className="ui-field block text-sm text-slate-200">
      <span className="ui-label mb-1.5 block font-medium">{label}</span>
      <textarea
        className={clsx(
          "ui-control min-h-[120px] w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15",
          className
        )}
        {...props}
      />
      {error ? <span className="ui-error mt-1.5 block text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function Panel({ className = "", children }) {
  return <div className={clsx("ui-panel panel-metal rounded-2xl", className)}>{children}</div>;
}

export function StatTile({ label, value, detail }) {
  return (
    <Panel className="p-5">
      <p className="ui-stat-label text-xs font-medium uppercase tracking-[0.16em] text-electric-500">{label}</p>
      <p className="ui-stat-value mt-2 font-display text-2xl font-bold text-gray-900">{value}</p>
      {detail ? <p className="ui-stat-detail mt-1 text-sm text-gray-500">{detail}</p> : null}
    </Panel>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    new: "border-sky-200 bg-sky-50 text-sky-700",
    qualified: "border-violet-200 bg-violet-50 text-violet-700",
    quoted: "border-amber-200 bg-amber-50 text-amber-700",
    negotiating: "border-orange-200 bg-orange-50 text-orange-700",
    won: "border-emerald-200 bg-emerald-50 text-emerald-700",
    lost: "border-rose-200 bg-rose-50 text-rose-700"
  };

  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", colors[status] || "border-gray-200 bg-gray-50 text-gray-700")}>
      {status}
    </span>
  );
}

export function LoadingPanel({ label = "Loading..." }) {
  return (
    <Panel className="p-8 text-center text-gray-500">
      <div className="ui-loading-spinner mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-black/5 border-t-electric-400" />
      <p className="ui-loading-label text-sm">{label}</p>
    </Panel>
  );
}

export function EmptyPanel({ title, body }) {
  return (
    <Panel className="p-8 text-center">
      <h3 className="ui-empty-title font-display text-lg font-bold text-gray-900">{title}</h3>
      <p className="ui-empty-body mt-2 text-sm text-gray-500">{body}</p>
    </Panel>
  );
}
