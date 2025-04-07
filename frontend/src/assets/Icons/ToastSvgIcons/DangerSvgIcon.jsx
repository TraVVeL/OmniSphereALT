import * as React from "react";
const DangerSvgIcon = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 0.72 0.72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: 'var(--bs-red)' }}
    {...props}
  >
    <path
      d="M.36.21v.18"
      stroke="currentColor"
      strokeWidth={0.045}
      strokeLinecap="round"
    />
    <path
      fill="currentColor"
      d="M.39.48a.03.03 0 0 1-.03.03.03.03 0 0 1-.03-.03.03.03 0 0 1 .06 0"
    />
    <path
      d="M.21.1A.3.3 0 0 1 .36.06.3.3 0 1 1 .1.21"
      stroke="currentColor"
      strokeWidth={0.045}
      strokeLinecap="round"
    />
  </svg>
);
export default DangerSvgIcon;
