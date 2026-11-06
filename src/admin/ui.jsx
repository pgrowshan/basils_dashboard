export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-circe text-[11px] font-semibold tracking-[0.18em] text-[#4372B8] uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-gelica text-[28px] leading-tight text-[#1A2744] sm:text-[32px]">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl font-circe text-sm leading-relaxed text-[#5C6B82]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[#E6E1D6] bg-white p-4 shadow-[0_8px_30px_rgba(26,39,68,0.04)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block font-circe text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase">
          {label}
        </span>
      )}
      {children}
      {hint && <span className="mt-1.5 block font-circe text-xs text-[#7A8BA3]">{hint}</span>}
    </label>
  );
}

const control =
  'w-full rounded-xl border border-[#D7DEE8] bg-[#FBF9F4] px-3.5 py-3 font-circe text-sm text-[#1A2744] outline-none transition focus:border-[#4372B8] focus:bg-white';

export function Input(props) {
  return <input {...props} className={`${control} ${props.className || ''}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${control} appearance-none ${props.className || ''}`}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea {...props} className={`${control} min-h-28 resize-y ${props.className || ''}`} />;
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const styles = {
    primary: 'bg-[#4372B8] text-white hover:bg-[#355f98]',
    secondary: 'border border-[#D7DEE8] bg-white text-[#1A2744] hover:bg-[#F7F4EE]',
    danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  };
  const sizes = {
    md: 'min-h-11 px-4 py-2.5 text-sm',
    sm: 'min-h-9 px-3 py-1.5 text-xs',
  };
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center rounded-xl font-circe font-semibold transition disabled:cursor-wait disabled:opacity-50 ${styles[variant]} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusNote({ tone = 'muted', children }) {
  const styles = {
    muted: 'text-[#5C6B82]',
    success: 'text-[#3E5A30]',
    danger: 'text-red-600',
  };
  return <p className={`font-circe text-sm ${styles[tone]}`}>{children}</p>;
}

export function EmptyState({ children }) {
  return (
    <Card>
      <p className="py-6 text-center font-circe text-sm text-[#5C6B82]">{children}</p>
    </Card>
  );
}

export function Badge({ children, tone = 'blue' }) {
  const styles = {
    blue: 'bg-[#E8F0FA] text-[#4372B8]',
    gold: 'bg-[#F6E7A8] text-[#3E5A30]',
    gray: 'bg-[#EEF1F5] text-[#5C6B82]',
    red: 'bg-red-50 text-red-600',
    green: 'bg-[#E8F4E6] text-[#3E5A30]',
    yellow: 'bg-[#FFF3D6] text-[#8A6D1B]',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 font-circe text-[11px] font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}
